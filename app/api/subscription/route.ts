import { SubscriptionPaymentQuery } from '@/types/payment/easypay';
import { checkEasyPaySetup } from '@/utils/payment/easypay';
import * as z from 'zod';
import * as Sentry from '@sentry/nextjs';
import { v4 as uuidv4 } from 'uuid';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';
import { captureSentryMessage } from '@/lib/sentry/logs';
import { getPayloadConfig } from '@/lib/payload/server';

const CONTRIBUTION_COLLECTION = 'contributions';

/**
 * Recurrence is chosen here, not by the caller.
 *
 * `frequency`, `start_time`, `capture_now`, `max_captures` and
 * `unlimited_payments` all used to come straight from the request body and were
 * forwarded verbatim to EasyPay — so a crafted request could put a donor on an
 * unlimited *daily* charge, or one starting at an arbitrary unvalidated time.
 * The donation widget only ever offered "monthly", so nothing legitimate needed
 * that freedom. Add plans here as the UI grows.
 */
const SUBSCRIPTION_PLANS = {
  monthly: { frequency: '1M', unlimited_payments: true, max_captures: undefined },
  quarterly: { frequency: '3M', unlimited_payments: true, max_captures: undefined },
  yearly: { frequency: '1Y', unlimited_payments: true, max_captures: undefined },
} as const;

type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;

export async function POST(request: Request) {
  const { allowed, retryAfter } = checkRateLimit(`subscription:${getClientIp(request)}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (!allowed) {
    return Response.json({}, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
  }

  try {
    checkEasyPaySetup();

    const body = await request.json();
    if (!body) {
      return Response.json({ error: 'Missing request body' }, { status: 400 });
    }

    const requestBody = prepareSubscriptionRequestBody(body);

    const response = await fetch(`${process.env.EASYPAY_API_URL}/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        AccountId: process.env.EASYPAY_ACCOUNT_ID!,
        ApiKey: process.env.EASYPAY_API_KEY!,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      captureSentryMessage('EasyPay single payment error:', 'info', {
        status: response.status,
        text: errorText,
      });
      return Response.json({ error: 'Error creating subscription' }, { status: response.status });
    }

    const data = await response.json();

    // Persist the subscription locally, the way /api/donate does for one-off
    // payments. Without this a recurring donation existed only in EasyPay's
    // dashboard until an authorisation notification happened to arrive, so there
    // was no local record to reconcile against.
    try {
      const payload = await getPayloadConfig();
      await payload.create({
        collection: CONTRIBUTION_COLLECTION,
        data: {
          donor: requestBody.customer?.name,
          contribution_type: 'BANK',
          value: requestBody.value,
          contribution_date: new Date().toISOString(),
          is_confirmed: false,
          easypay_id: requestBody.key,
          transaction_key: requestBody.key,
          payment_method: 'CC',
          extra_info: { subscription: true, frequency: requestBody.frequency, ...data },
        },
      });
    } catch (dbError) {
      // The subscription exists at EasyPay at this point; failing the request
      // would tell the donor it did not. Record it loudly instead.
      Sentry.captureException(dbError, {
        extra: { transactionKey: requestBody.key, stage: 'subscription-contribution-create' },
      });
    }

    return Response.json(data, { status: 200 });
  } catch (e: unknown) {
    Sentry.captureException(e);
    if (e instanceof z.ZodError) {
      return Response.json({}, { status: 400 });
    }
    return Response.json({}, { status: 500 });
  }
}

function prepareSubscriptionRequestBody(body: Record<string, unknown>): SubscriptionPaymentQuery {
  const schema = z.object({
    value: z.coerce.number().positive().max(50_000),
    email: z.email(),
    name: z.string().min(1).max(120),
    currency: z.enum(['EUR']).default('EUR'),
    // The only recurrence input. Everything else about the schedule is derived
    // from SUBSCRIPTION_PLANS above — see the comment there.
    plan: z
      .enum(Object.keys(SUBSCRIPTION_PLANS) as [SubscriptionPlan, ...SubscriptionPlan[]])
      .default('monthly'),
    phone_number: z.string().max(20).optional(),
    phone_indicative: z.string().max(6).optional(),
    reason: z.string().max(255).optional(),
  });

  const parsedBody = schema.parse(body);
  const plan = SUBSCRIPTION_PLANS[parsedBody.plan];

  const transactionKey = uuidv4();
  const now = new Date();
  // Always a minute from now. Was caller-supplied and unvalidated.
  const startTime = formatEasyPayDate(new Date(now.getTime() + 60 * 1000));

  return {
    currency: parsedBody.currency,
    key: transactionKey,
    value: parsedBody.value,
    frequency: plan.frequency,
    method: 'CC',
    start_time: startTime,
    capture_now: true,
    retries: 3,
    failover: false,
    unlimited_payments: plan.unlimited_payments,
    ...(plan.max_captures ? { max_captures: plan.max_captures } : {}),
    capture: {
      transaction_key: transactionKey,
      descriptive:
        parsedBody.reason || `Monthly Donation - ${parsedBody.name} - ${new Date().toISOString()}`,
    },
    customer: {
      name: parsedBody.name,
      email: parsedBody.email,
      phone: parsedBody.phone_number,
      phone_indicative: parsedBody.phone_indicative,
      key: parsedBody.email,
      language: 'PT',
    },
  };
}

function formatEasyPayDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

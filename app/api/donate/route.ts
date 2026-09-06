import { SinglePaymentQuery } from '@/types/payment/easypay';
import { checkEasyPaySetup } from '@/utils/payment/easypay';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getPayloadConfig } from '@/lib/payload/server';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';
import { captureSentryMessage } from '@/lib/sentry/logs';

const CONTRIBUTION_COLLECTION = 'contributions';

export async function POST(request: Request) {
  const { allowed, retryAfter } = checkRateLimit(`donate:${getClientIp(request)}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (!allowed) {
    return Response.json({}, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
  }

  const payload = await getPayloadConfig();
  try {
    checkEasyPaySetup();

    const body = await request.json();
    if (!body) return Response.json({}, { status: 400 });

    const requestBody = prepareEasyPayRequestBody(body);

    const response = await fetch(`${process.env.EASYPAY_API_URL}/single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        AccountId: process.env.EASYPAY_ACCOUNT_ID!,
        ApiKey: process.env.EASYPAY_API_KEY!,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      captureSentryMessage('EasyPay single payment error:', 'info', {
        status: response.status,
        text: error.message,
      });

      return Response.json({}, { status: response.status });
    }

    const data = await response.json();

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
        payment_method: requestBody.method,
        extra_info: {
          ...data,
        },
      },
    });

    // Return the EasyPay response — the donation widget needs it (e.g. the
    // Multibanco entity/reference shown on the "done" step).
    return Response.json(data, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return Response.json({ error: 'Invalid request data' }, { status: 400 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function prepareEasyPayRequestBody(body: Record<string, unknown>): SinglePaymentQuery {
  const schema = z.object({
    // Cap the amount so a forged/abusive request can't attempt an absurd charge.
    value: z.coerce.number().positive().max(50_000),
    paymentType: z.enum(['CC', 'MB', 'MBW']),
    email: z.email(),
    name: z.string().min(1).max(120),
    currency: z.enum(['EUR']).default('EUR'),
    phone_number: z.string().max(20).optional(),
    phone_indicative: z.string().max(6).optional(),
    reason: z.string().max(255).optional(),
  });

  const parsedBody = schema.parse(body);

  const transactionKey = uuidv4();

  return {
    type: 'sale',
    customer: {
      name: parsedBody.name,
      email: parsedBody.email,
      phone: parsedBody.phone_number,
      phone_indicative: parsedBody.phone_indicative,
      key: parsedBody.email,
      language: 'PT',
    },
    currency: parsedBody.currency,
    key: transactionKey,
    value: parsedBody.value,
    method: parsedBody.paymentType,
    capture: {
      descriptive:
        parsedBody.reason || `Donation - ${parsedBody.name} - ${new Date().toISOString()}`,
      transaction_key: transactionKey,
    },
    notification: {
      customer_method_instructions_email: true,
    },
  };
}

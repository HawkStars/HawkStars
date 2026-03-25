import { SubscriptionPaymentQuery } from '@/types/payment/easypay';
import { checkEasyPaySetup } from '@/utils/payment/easypay';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
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
      console.error('EasyPay subscription error:', response.status, errorText);
      return Response.json({ error: 'Error creating subscription' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return Response.json({ error: 'Invalid request data', details: e.issues }, { status: 400 });
    }
    console.error('Subscription route error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function prepareSubscriptionRequestBody(body: Record<string, unknown>): SubscriptionPaymentQuery {
  const schema = z.object({
    value: z.coerce.number().positive(),
    email: z.string().email(),
    name: z.string().min(1),
    currency: z.enum(['EUR']).default('EUR'),
    frequency: z
      .enum(['1D', '1W', '2W', '1M', '2M', '3M', '4M', '6M', '1Y', '2Y', '3Y'])
      .default('1M'),
    phone_number: z.string().optional(),
    phone_indicative: z.string().optional(),
    reason: z.string().optional(),
    start_time: z.string().optional(),
    capture_now: z.boolean().optional().default(true),
    max_captures: z.number().optional(),
    unlimited_payments: z.boolean().optional().default(true),
  });

  const parsedBody = schema.parse(body);

  const transactionKey = uuidv4();
  const now = new Date();
  const startTime = parsedBody.start_time || formatEasyPayDate(new Date(now.getTime() + 60 * 1000));

  return {
    currency: parsedBody.currency,
    key: transactionKey,
    value: parsedBody.value,
    frequency: parsedBody.frequency,
    method: 'CC',
    start_time: startTime,
    capture_now: parsedBody.capture_now,
    retries: 3,
    failover: false,
    unlimited_payments: parsedBody.unlimited_payments,
    ...(parsedBody.max_captures && !parsedBody.unlimited_payments
      ? { max_captures: parsedBody.max_captures }
      : {}),
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

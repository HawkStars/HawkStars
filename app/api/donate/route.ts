import { SinglePaymentQuery } from '@/types/payment/easypay';
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
      const errorText = await response.text();
      debugger;
      console.error('EasyPay single payment error:', response.status, errorText);
      return Response.json({ error: 'Error processing payment' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return Response.json({ error: 'Invalid request data', details: e.issues }, { status: 400 });
    }
    console.error('Donate route error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function prepareEasyPayRequestBody(body: Record<string, unknown>): SinglePaymentQuery {
  const schema = z.object({
    value: z.coerce.number().positive(),
    paymentType: z.enum(['CC', 'MB', 'MBW']),
    email: z.email(),
    name: z.string().min(1),
    currency: z.enum(['EUR']).default('EUR'),
    phone_number: z.string().optional(),
    phone_indicative: z.string().optional(),
    reason: z.string().optional(),
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

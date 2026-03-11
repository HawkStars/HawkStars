import { SinglePaymentQuery } from '@/types/payment/easypay';
import { checkEasyPaySetup } from '@/utils/payment/easypay';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  checkEasyPaySetup();

  const body = await request.json();
  if (!body) return new Response('Missing Information', { status: 404 });

  const requestBody = prepareEasyPayRequestBody(body);

  try {
    const query = fetch(`${process.env.EASYPAY_API_URL}/single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        AccountId: process.env.EASYPAY_ACCOUNT_ID || '',
        ApiKey: process.env.EASYPAY_API_KEY || '',
      },
      body: JSON.stringify(requestBody),
    });

    const response = await query;
    if (!response.ok) {
      return new Response('Error processing payment', { status: 404 });
    }

    const data = await response.json();
  } catch (e: unknown) {
    return new Response('error on the client', { status: 404 });
  }
}

function prepareEasyPayRequestBody(body: Record<string, unknown>): SinglePaymentQuery {
  z;

  const schema = z.object({
    value: z.coerce.number().positive(),
    paymentType: z.enum(['CC', 'MB', 'MBW']),
    email: z.email(),
    name: z.string(),
    currency: z.enum(['EUR']),
    phone_number: z.string().optional(),
    phone_indiciative: z.string().optional(),
    reason: z.string().optional(),
  });

  const parsedBody = schema.parse(body);

  return {
    customer: {
      name: parsedBody.name,
      email: parsedBody.email,
      phone: parsedBody.phone_number,
      phone_indicative: parsedBody.phone_indiciative,
      key: parsedBody.email,
      language: 'PT',
    },
    currency: parsedBody.currency,
    key: 'merchant identification key Example',
    value: parsedBody.value,
    method: parsedBody.paymentType,
    capture: {
      descriptive:
        parsedBody.reason || `Donation - ${parsedBody.email} - ${new Date().toISOString()}`,
      transaction_key: uuidv4(),
    },
    notification: {
      customer_method_instructions_email: true,
    },
  };
}

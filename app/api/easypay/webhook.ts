import { checkEasyPaySetup } from '@/utils/payment/easypay';
import * as z from 'zod';

export async function POST(request: Request) {
  checkEasyPaySetup();

  debugger;
  const body = await request.json();

  return new Response('ok', { status: 200 });
}

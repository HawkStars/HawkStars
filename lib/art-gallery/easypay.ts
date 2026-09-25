import { SinglePaymentMethod, SinglePaymentQuery } from '@/types/payment/easypay';
import { checkEasyPaySetup } from '@/utils/payment/easypay';

/**
 * Minimal EasyPay API 2.0 client for the gallery's single payments
 * (https://docs.easypay.pt/openapi/single-payment).
 */

const REQUEST_TIMEOUT_MS = 15_000;

export class EasyPayError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string
  ) {
    super(message);
    this.name = 'EasyPayError';
  }
}

/** Response of `POST /single` (fields the gallery uses). */
export type EasyPayCreatedPayment = {
  status?: string;
  id: string;
  method?: {
    type?: SinglePaymentMethod;
    status?: string;
    entity?: string | number;
    reference?: string;
    url?: string;
    expiration_date?: string;
  };
  multibanco?: { expiration_time?: string | null };
};

/** `payment_status` of `GET /single/{id}`. */
export type EasyPayPaymentStatus =
  'pending' | 'paid' | 'authorised' | 'error' | 'deleted' | 'failed' | 'active';

/** Response of `GET /single/{id}` (fields the gallery uses). */
export type EasyPaySinglePayment = {
  id: string;
  key?: string;
  value?: number;
  payment_status: EasyPayPaymentStatus;
  paid_at?: string | null;
  method?: EasyPayCreatedPayment['method'];
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  checkEasyPaySetup();

  const response = await fetch(`${process.env.EASYPAY_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      AccountId: process.env.EASYPAY_ACCOUNT_ID!,
      ApiKey: process.env.EASYPAY_API_KEY!,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: 'no-store',
  });

  const text = await response.text();
  if (!response.ok) {
    throw new EasyPayError(`EasyPay ${init.method ?? 'GET'} ${path} failed`, response.status, text);
  }
  return JSON.parse(text) as T;
}

export const createSinglePayment = (
  body: SinglePaymentQuery & { multibanco?: { expiration_time: string } }
) => request<EasyPayCreatedPayment>('/single', { method: 'POST', body: JSON.stringify(body) });

export const getSinglePayment = (id: string) =>
  request<EasyPaySinglePayment>(`/single/${encodeURIComponent(id)}`);

/** RFC 3339 without milliseconds (e.g. "2024-06-30T21:38:31Z"), as EasyPay expects. */
export const toEasyPayDateTime = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z');

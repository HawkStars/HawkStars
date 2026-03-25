import { SinglePaymentMethod } from '@/types/payment/easypay';

export type DonationType = 'one-time' | 'monthly';

export type PaymentMethodOption = SinglePaymentMethod;

export type DonationState = {
  frequency: DonationType;
  amount: number | null;
  comment: string;
  name: string;
  email: string;
  phone_number: string;
  phone_indicative: string;
  paymentMethod: PaymentMethodOption | null;
};

export type StepConfig = {
  id: number;
  label: string;
};

export const STEPS: StepConfig[] = [
  { id: 1, label: 'Amount' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirm' },
  { id: 5, label: 'Done' },
];

export const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500] as const;

export const getActiveAmount = (state: DonationState): number | null => {
  return state.amount;
};

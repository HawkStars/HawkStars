/**
 *
 * EASYPAY
 * -----
 * SINGLE PAYMENT
 *
 */

export type SinglePaymentCaptureQuery = {
  descriptive: string;
  transaction_key?: string;
  account?: { id: string };
  capture_date?: string;
  splits?: Array<{
    split_key: string;
    split_descriptive: string;
    account: { id: string };
    value: number;
    clearing_period: string;
    margin_account: { id: string };
    margin_value: number;
  }>;
};

export type SinglePaymentQuery = {
  capture?: SinglePaymentCaptureQuery;
  currency?: string;
  value: number;
  method: SinglePaymentMethod;
  key: string;
  customer?: EasyPayCustomerInfo;
  sdd_mandate?: SDDMandateQuery;
  notification: { customer_method_instructions_email: boolean };
};

export type MultibancoQuery = {
  expiration_time: string;
  start_time: string;
  product: MultibancoProductType;
};

// default is checkdigit
export type MultibancoProductType = 'FILE' | 'SPG' | 'CHECKDIGIT';

/**
 *
 * EASYPAY
 * -----
 * SUBSCRIPTION PAYMENT
 *
 */

export type SubscriptionPaymentQuery = {
  frequent_id: string;
  expiration_time: string;
  currency: string;
  capture: {
    transaction_key: string;
    account: { id: string };
    descriptive: string;
  };
  customer: {
    id: string;
    name: string;
    email: string;
  };
  key: string;
  value: number;
  frequency: SubscriptionFrequency;
  max_captures: number;
  unlimited_payments: boolean;
  start_time: string;
  failover: boolean;
  capture_now: boolean;
  retries: number;
  method: SubscriptionPaymentMethod;
  sdd_mandate: SDDMandateQuery;
};

/**
 * COMMON TYPES
 */

// SDD = SEPA Direct Debit - Only required for Debit payments, but can be included in the payload for other payment types if needed for future use or specific cases.
export type SDDMandateQuery = {
  iban: string;
  key: string;
  name: string;
  email: string;
  phone: string;
  account_holder: string;
  country_code: string;
  max_num_debits: string;
  billing_entity: string;
};

export type SinglePaymentMethod = 'CC' | 'MB' | 'MBW';
export type SubscriptionPaymentMethod = 'CC';
export type SubscriptionFrequency =
  | '1D'
  | '1W'
  | '2W'
  | '1M'
  | '2M'
  | '3M'
  | '4M'
  | '6M'
  | '1Y'
  | '2Y'
  | '3Y';

export type EasyPayCustomerInfo = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  phone_indicative?: string;
  fiscal_number?: string;
  key?: string;
  language?: string;
};

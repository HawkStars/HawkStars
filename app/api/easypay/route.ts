import { getPayloadConfig } from '@/lib/payload/server';
import * as Sentry from '@sentry/nextjs';
import {
  EasyPayGenericNotification,
  EasyPayAuthorisationNotification,
  EasyPayTransactionNotification,
} from '@/types/payment/easypay';

const CONTRIBUTION_COLLECTION = 'contributions';

/**
 * Verify the request actually came from EasyPay.
 *
 * EasyPay v2 does not HMAC-sign notification payloads, so the recommended
 * defense is a shared secret on the notification URL plus (ideally) an
 * out-of-band status re-check against the EasyPay API. We require a secret
 * token — configured in EASYPAY_WEBHOOK_SECRET and appended to the webhook URL
 * registered in the EasyPay dashboard (e.g. .../api/easypay?token=SECRET, or
 * sent as an `x-webhook-token` header).
 *
 * If the secret is not configured we do NOT hard-fail (that would silently
 * drop every payment confirmation the moment this deploys), but we report it
 * so the gap is visible until the secret is set on both ends.
 */
function isAuthorisedWebhook(request: Request): boolean {
  const expected = process.env.EASYPAY_WEBHOOK_SECRET;

  if (!expected) {
    Sentry.captureMessage(
      'EasyPay webhook received without EASYPAY_WEBHOOK_SECRET configured — endpoint is unauthenticated',
      { level: 'warning' }
    );
    return false;
  }

  const url = new URL(request.url);
  const provided = request.headers.get('x-webhook-token') ?? url.searchParams.get('token');

  return provided === expected;
}

/**
 * EasyPay Webhook Handler
 *
 * Receives POST notifications from EasyPay about payment status changes.
 * Notification types:
 * - Generic: { id, key, type, status, messages, date }
 * - Authorisation: { id, value, currency, key, customer, method, account, authorisation }
 * - Transaction: { id, key, type, status, messages, date, value, currency, method }
 *
 * Must respond with HTTP 200 within 20 seconds.
 */
export async function POST(request: Request) {
  try {
    if (!isAuthorisedWebhook(request)) {
      console.warn('EasyPay webhook: rejected request with missing/invalid token');
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body || !body.id) {
      console.warn('EasyPay webhook: received empty or invalid payload');
      return Response.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    // Log identifiers only — the full payload contains customer PII (name,
    // email, phone) that must not end up in plaintext logs.
    console.log(
      `EasyPay webhook received: id=${body.id}, key=${body.key ?? 'n/a'}, type=${body.type ?? 'n/a'}, status=${body.status ?? 'n/a'}`
    );

    // Determine notification type based on payload structure
    if (isAuthorisationNotification(body)) {
      await handleAuthorisationNotification(body);
    } else if (isTransactionNotification(body)) {
      await handleTransactionNotification(body);
    } else {
      await handleGenericNotification(body);
    }

    // Always respond with 200 to acknowledge receipt
    return Response.json({ success: true }, { status: 200 });
  } catch (e: unknown) {
    // Surface the failure — without this, a broken webhook (DB down, malformed
    // payload) is completely silent while we keep telling EasyPay "success".
    Sentry.captureException(e);
    console.error('EasyPay webhook error:', e);
    // Still return 200 to prevent EasyPay from retrying endlessly
    return Response.json({ success: true }, { status: 200 });
  }
}

function isAuthorisationNotification(
  body: Record<string, unknown>
): body is EasyPayAuthorisationNotification {
  return 'authorisation' in body && 'customer' in body && 'method' in body;
}

function isTransactionNotification(
  body: Record<string, unknown>
): body is EasyPayTransactionNotification {
  return 'type' in body && 'status' in body && 'value' in body;
}

/**
 * Handle generic notifications (capture success/failure)
 */
async function handleGenericNotification(notification: EasyPayGenericNotification): Promise<void> {
  console.log(
    `EasyPay generic notification: type=${notification.type}, status=${notification.status}, id=${notification.id}`
  );

  if (notification.status === 'success' && notification.type === 'capture') {
    await updateContributionStatus(notification.key, true);
  } else if (notification.status === 'failed') {
    await updateContributionStatus(notification.key, false);
  }
}

const VALID_PAYMENT_METHODS = ['CC', 'MB', 'MBW'] as const;
type ValidPaymentMethod = (typeof VALID_PAYMENT_METHODS)[number];

function toPaymentMethod(method: string): ValidPaymentMethod | undefined {
  const upper = method.toUpperCase();
  return VALID_PAYMENT_METHODS.includes(upper as ValidPaymentMethod)
    ? (upper as ValidPaymentMethod)
    : undefined;
}

/**
 * Handle authorisation notifications (payment authorised)
 */
async function handleAuthorisationNotification(
  notification: EasyPayAuthorisationNotification
): Promise<void> {
  console.log(
    `EasyPay authorisation notification: id=${notification.id}, method=${notification.method}, value=${notification.value}`
  );

  // Create a contribution record when a payment is authorised
  try {
    const payload = await getPayloadConfig();

    await payload.create({
      collection: CONTRIBUTION_COLLECTION,
      data: {
        donor: notification.customer?.name || 'Anonymous',
        value: notification.value,
        is_confirmed: false,
        is_anonymous: !notification.customer?.name,
        contribution_date: new Date().toISOString(),
        contribution_type: 'BANK',
        extra_info: `EasyPay ${notification.method.toUpperCase()} - Auth ID: ${notification.authorisation?.id || notification.id}`,
        transaction_key: notification.key,
        easypay_id: notification.authorisation?.id || notification.id,
        payment_method: toPaymentMethod(notification.method),
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error creating contribution from authorisation:', error);
  }
}

/**
 * Handle transaction/capture notifications (payment captured)
 */
async function handleTransactionNotification(
  notification: EasyPayTransactionNotification
): Promise<void> {
  console.log(
    `EasyPay transaction notification: type=${notification.type}, status=${notification.status}, id=${notification.id}`
  );

  if (notification.status === 'success') {
    await updateContributionStatus(notification.key, true);
  } else if (notification.status === 'failed') {
    await updateContributionStatus(notification.key, false);
  }
}

/**
 * Update contribution confirmation status by matching the transaction key
 */
async function updateContributionStatus(
  transactionKey: string,
  isConfirmed: boolean
): Promise<void> {
  try {
    const payload = await getPayloadConfig();

    // Find contribution by the transaction key field
    const contributions = await payload.find({
      collection: CONTRIBUTION_COLLECTION,
      where: {
        transaction_key: {
          equals: transactionKey,
        },
      },
      limit: 1,
    });

    if (contributions.docs.length > 0) {
      const contribution = contributions.docs[0];
      await payload.update({
        collection: CONTRIBUTION_COLLECTION,
        id: contribution.id,
        data: {
          is_confirmed: isConfirmed,
        },
      });
      console.log(`Contribution ${contribution.id} updated: is_confirmed=${isConfirmed}`);
    } else {
      console.warn(`No contribution found for transaction key: ${transactionKey}`);
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error updating contribution status:', error);
  }
}

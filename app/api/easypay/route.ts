import { getPayloadConfig } from '@/lib/payload/server';
import {
  EasyPayGenericNotification,
  EasyPayAuthorisationNotification,
  EasyPayTransactionNotification,
} from '@/types/payment/easypay';

const CONTRIBUTION_COLLECTION = 'contributions';

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
    const body = await request.json();

    if (!body || !body.id) {
      console.warn('EasyPay webhook: received empty or invalid payload');
      return Response.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    console.log('EasyPay webhook received:', JSON.stringify(body));

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
      },
    });
  } catch (error) {
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

    // Find contribution by the transaction key stored in extra_info
    const contributions = await payload.find({
      collection: CONTRIBUTION_COLLECTION,
      where: {
        extra_info: {
          contains: transactionKey,
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
    console.error('Error updating contribution status:', error);
  }
}

import * as Sentry from '@sentry/nextjs';
import type { BasePayload } from 'payload';

type GalleryEmail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

/**
 * Sends a plain-text email through Payload's mailer (Gmail in production; in
 * development Payload only logs it). Never throws — the order/proposal it
 * reports on is already saved and must not fail because of the email.
 */
export async function sendGalleryEmail(payload: BasePayload, email: GalleryEmail) {
  try {
    await payload.sendEmail({
      to: email.to,
      subject: email.subject,
      text: email.text,
      replyTo: email.replyTo,
    });
    return true;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

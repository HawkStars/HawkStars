import { NextResponse } from 'next/server';
import { getPayloadConfig } from '@/lib/payload/server';

/**
 * GET /api/health
 *
 * Used by the deploy workflow to confirm a freshly started PM2 process is
 * actually serving traffic (and can reach the DB) before the deploy is
 * considered successful — previously there was no such check, so a build
 * that compiled but crash-looped on boot was reported as a successful
 * deploy. Also a stable target for external uptime monitoring, which this
 * project has none of beyond Sentry (which can't report anything if the
 * process never finishes booting).
 *
 * Intentionally unauthenticated and minimal — no request details, no stack
 * traces, just enough to prove the app process and DB connection are alive.
 */
export async function GET() {
  try {
    const payload = await getPayloadConfig();
    // Cheapest possible query that still round-trips to Mongo.
    await payload.find({ collection: 'users', limit: 0, pagination: false, depth: 0 });

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 503 });
  }
}

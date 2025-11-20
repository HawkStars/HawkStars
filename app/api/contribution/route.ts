import { getPayloadConfig } from '@/lib/payload/server';

const CONTRIBUTION_COLLECTION = 'contributions';

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) return new Response('', { status: 404 });

  try {
    const payload = await getPayloadConfig();

    const data = await payload.create({
      collection: CONTRIBUTION_COLLECTION,
      data: body,
    });

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (e: unknown) {
    console.error('Error creating contribution:', e);
    return new Response('error on the client', { status: 500 });
  }
}

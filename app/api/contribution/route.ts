import { serverClient } from '@/lib/sanity/sanityClient';

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return new Response('', { status: 404 });
  }

  try {
    await serverClient.create(body);

    return new Response('', {
      status: 200,
    });
  } catch (e) {
    return new Response('error on the client', { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return new Response('', { status: 404 });
  }

  try {
    // TODO: Integrate with Payload CMS
    //  await serverClient.create(body);

    return new Response('', {
      status: 200,
    });
  } catch (e) {
    return new Response('error on the client', { status: 500 });
  }
}

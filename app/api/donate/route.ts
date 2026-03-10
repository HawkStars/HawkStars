export async function POST(request: Request) {
  checkEasyPayEnvironmentVariables();

  const body = await request.json();
  if (!body) return new Response('', { status: 404 });

  try {
    const query = fetch(`${process.env.EASYPAY_API_URL}/single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        AccountId: process.env.EASYPAY_ACCOUNT_ID || '',
        ApiKey: process.env.EASYPAY_API_KEY || '',
      },
      body: JSON.stringify(body),
    });

    const response = await query;
    if (!response.ok) {
      return new Response('Error processing payment', { status: 500 });
    }

    const data = await response.json();
  } catch (e: unknown) {
    return new Response('error on the client', { status: 500 });
  }
}

function checkEasyPayEnvironmentVariables() {
  if (!process.env.EASYPAY_ACCOUNT_ID)
    throw new Error('EASYPAY_ACCOUNT_ID environment variable is not assigned');

  if (!process.env.EASYPAY_API_KEY)
    throw new Error('EASYPAY_API_KEY environment variable is not assigned');

  if (!process.env.EASYPAY_API_URL)
    throw new Error('EASYPAY_API_URL environment variable is not assigned');
}

function prepareEasyPayRequestBody(body: any) {}

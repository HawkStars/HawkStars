function checkEasyPaySetup() {
  if (!process.env.EASYPAY_ACCOUNT_ID)
    throw new Error('EASYPAY_ACCOUNT_ID environment variable is not assigned');

  if (!process.env.EASYPAY_API_KEY)
    throw new Error('EASYPAY_API_KEY environment variable is not assigned');

  if (!process.env.EASYPAY_API_URL)
    throw new Error('EASYPAY_API_URL environment variable is not assigned');
}

export { checkEasyPaySetup };

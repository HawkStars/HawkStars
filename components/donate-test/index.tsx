'use client';

const DonateTest = () => {
  const handleDonateClick = async () => {
    const response = await fetch('/api/donate', {
      method: 'POST',
      body: JSON.stringify({
        value: 10,
        paymentType: 'MB',
        email: 'pcardoso.lei@gmail.com',
        name: 'Test User',
        currency: 'EUR',
      }),
    });

    if (!response.ok) {
      console.error('Failed to initiate donation:', await response.text());
      alert('Failed to initiate donation. Please try again later.');
      return;
    }

    const data = await response.json();
    console.log('Donation response:', data);
  };

  return (
    <button className='rounded-2xl border p-2' onClick={handleDonateClick}>
      Testar EasyPay
    </button>
  );
};

export default DonateTest;

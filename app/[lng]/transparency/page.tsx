const TransparencyPage = () => {
  return (
    <section className='flex flex-col gap-5'>
      <div className='mx-10 mt-10 flex flex-col gap-3'>
        <h3>Current Project Contribution:</h3>
        <div className='relative h-6 w-full rounded-md border border-bege-dark'>
          <div className='h-full w-1/3 bg-gradient-to-r from-bege-dark from-10% to-bege-light to-90%'></div>
          <p className='absolute bottom-0 right-3 text-sm'>1.200.000,00€</p>
        </div>
      </div>
    </section>
  );
};

export default TransparencyPage;

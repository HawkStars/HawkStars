const ArtPage = () => {
  return (
    <>
      {/* Main Section */}
      <section className='bg-bege-light'>
        <div className='flex flex-col lg:flex-row'>
          <div className='w-full lg:w-[45%]'></div>
          <div className='flex w-full flex-col lg:w-[55%]'>
            <h1>Title</h1>
            <h6>Price</h6>
            <div className='grid grid-cols-1 lg:grid-cols-2'></div>
          </div>
        </div>
      </section>
      {/* Other images */}
      <section></section>
      {/* Other Caracteristics */}
      <section></section>
    </>
  );
};

export default ArtPage;

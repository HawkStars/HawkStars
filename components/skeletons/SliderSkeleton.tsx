const SliderSkeleton = () => {
  return (
    <div className='flex animate-pulse gap-8 bg-bege-light px-8'>
      <div className='h-96 rounded-lg bg-bege-dark md:w-1/2 lg:w-1/3'></div>
      <div className='h-96 rounded-lg bg-bege-dark md:hidden md:w-1/2 lg:w-1/3'></div>
      <div className='h-96 rounded-lg bg-bege-dark sm:hidden md:w-1/2 lg:w-1/3'></div>
    </div>
  );
};

export default SliderSkeleton;

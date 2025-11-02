const SliderSkeleton = () => {
  return (
    <div className='bg-bege-light flex animate-pulse gap-8 px-8'>
      <div className='bg-bege-dark h-96 rounded-lg md:w-1/2 lg:w-1/3'></div>
      <div className='bg-bege-dark h-96 rounded-lg md:hidden md:w-1/2 lg:w-1/3'></div>
      <div className='bg-bege-dark h-96 rounded-lg sm:hidden md:w-1/2 lg:w-1/3'></div>
    </div>
  );
};

export default SliderSkeleton;

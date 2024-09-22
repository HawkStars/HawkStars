const SliderSkeleton = () => {
  return (
    <div className='flex animate-pulse gap-8 bg-bege-light px-8'>
      <div className='h-96 w-1/3 rounded-lg bg-bege-dark'></div>
      <div className='h-96 w-1/3 rounded-lg bg-bege-dark'></div>
      <div className='h-96 w-1/3 rounded-lg bg-bege-dark'></div>
    </div>
  );
};

export default SliderSkeleton;

import * as React from 'react';
import Image from 'next/image';

const Test = () => {
  return (
    <>
      <div className='flex flex-col items-stretch'>
        <div className='flex w-full flex-col items-center bg-stone-50 px-5 py-32 max-md:max-w-full max-md:py-24'>
          <div className='mb-0 w-full max-w-[1090px] max-md:mb-2.5 max-md:max-w-full'>
            <div className='flex gap-5 max-md:flex-col max-md:items-stretch max-md:gap-0'>
              <div className='flex w-[48%] flex-col items-stretch max-md:ml-0 max-md:w-full'>
                <div className='my-auto flex flex-col items-stretch max-md:mt-10 max-md:max-w-full'>
                  <div className='text-5xl font-semibold leading-[49.44px] text-black max-md:max-w-full max-md:text-4xl'>
                    O projeto
                  </div>
                  <div className='mt-4 text-2xl font-light leading-7 text-black max-md:max-w-full'>
                    Num corações da zona histórica da Cidade de Pinhel, no
                    distrito da Guarda, em Portugal, nascerá um projeto
                    visionário e futurista que promete não apenas redefinir a
                    paisagem urbana, mas contribuir para o desenvolvimento do
                    cenário sócio económico da cidadee da região em que está
                    inserido.
                  </div>
                </div>
              </div>
              <div className='ml-5 flex w-[52%] flex-col items-stretch max-md:ml-0 max-md:w-full'>
                <Image
                  loading='lazy'
                  src='/images/hero.png'
                  className='aspect-[1.2] w-full overflow-hidden object-contain object-center max-md:mt-10 max-md:max-w-full'
                  alt='hero'
                  width='400'
                  height='400'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;

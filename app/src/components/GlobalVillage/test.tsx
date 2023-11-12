import * as React from "react";
import Image from "next/image";

const Test = () => {
  return (
    <>
      <div className="items-stretch flex flex-col">
        <div className="bg-stone-50 flex w-full flex-col items-center px-5 py-32 max-md:max-w-full max-md:py-24">
          <div className="mb-0 w-full max-w-[1090px] max-md:max-w-full max-md:mb-2.5">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[48%] max-md:w-full max-md:ml-0">
                <div className="items-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
                  <div className="text-black text-5xl font-semibold leading-[49.44px] max-md:max-w-full max-md:text-4xl">
                    O projeto
                  </div>
                  <div className="text-black text-2xl font-light leading-7 mt-4 max-md:max-w-full">
                    Num corações da zona histórica da Cidade de Pinhel, no
                    distrito da Guarda, em Portugal, nascerá um projeto
                    visionário e futurista que promete não apenas redefinir a
                    paisagem urbana, mas contribuir para o desenvolvimento do
                    cenário sócio económico da cidadee da região em que está
                    inserido.
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch w-[52%] ml-5 max-md:w-full max-md:ml-0">
                <Image
                  loading="lazy"
                  src="/imgs/hero.png"
                  className="aspect-[1.2] object-contain object-center w-full overflow-hidden max-md:max-w-full max-md:mt-10"
                  alt="hero"
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

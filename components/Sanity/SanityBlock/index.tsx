import { InternationalizedArrayFormattedText } from '@/lib/sanity/sanity.types';
import { PortableText, PortableTextComponents } from '@portabletext/react';

type SanityBlockProps = {
  block: InternationalizedArrayFormattedText;
  lng: string;
};

const defaultComponents: PortableTextComponents = {
  types: {
    art_property: (props) => {
      debugger;
      return <div className='flex flex-col gap-2'></div>;
    },
  },
  marks: {
    link: ({ value, children }) => {
      return (
        <a href={value?.href} className='text-green'>
          {children}
        </a>
      );
    },
  },
  block: {
    normal: ({ children }) => {
      return <div className='lg:text-h2_light text-body_regular'>{children}</div>;
    },
  },
};

const SanityBlock = ({ block, lng }: SanityBlockProps) => {
  const info = block?.find((item) => item._key == lng);
  if (!info?.value) return <></>;

  return (
    <>
      <PortableText value={info.value} components={defaultComponents} />
    </>
  );
};

export default SanityBlock;

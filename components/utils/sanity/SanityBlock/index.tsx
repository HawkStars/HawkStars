import { InternationalizedArrayFormattedText } from '@/projects/sanity/sanity.types';
import { PortableText, PortableTextComponents } from '@portabletext/react';

type SanityBlockProps = {
  block: InternationalizedArrayFormattedText;
  lng: string;
};

const defaultComponents: PortableTextComponents = {
  types: {
    accordion: () => {
      return <div></div>;
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
      if (children == '') return <></>;
      return <p className='lg:text-h2_light text-body_regular my-2 text-justify'>{children}</p>;
    },
    h1: ({ children }) => {
      if ((children = '')) return <></>;
      return <h1 className='text-h1_semibold'>{children}</h1>;
    },
    h2: ({ children }) => {
      if ((children = '')) return <></>;
      return <h2 className='text-h2_bold'>{children}</h2>;
    },
  },
};

const SanityBlock = ({ block, lng }: SanityBlockProps) => {
  const info = block?.find((item) => item._key == lng);
  if (!info?.value) return <></>;

  return <PortableText value={info.value} components={defaultComponents} />;
};

export default SanityBlock;

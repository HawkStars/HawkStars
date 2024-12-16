import { PortableText } from '@portabletext/react';

type SanityBlockProps = {
  block: any;
};

const SanityBlock = ({ block }: SanityBlockProps) => {
  debugger;
  return (
    <>
      <PortableText value={block[0].value} />
    </>
  );
};

export default SanityBlock;

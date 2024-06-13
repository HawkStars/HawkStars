import { ReactNode } from 'react';
import { tw, variantProps } from 'classname-variants/react';

type SectionProps = {
  children: ReactNode;
  width?: 'full' | 'half';
};

const sectionProps = variantProps({
  base: tw`px-4 lg:mx-auto lg:px-40`,
  variants: {
    width: {
      full: tw`w-full`,
      half: tw`w-1/2`,
    },
  },
  defaultVariants: { width: undefined },
});

export const Section = (props: SectionProps) => {
  const { children } = props;
  return <section {...sectionProps({ ...props })}>{children}</section>;
};

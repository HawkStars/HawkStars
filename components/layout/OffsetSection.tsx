import { tw, variantProps } from 'classname-variants/react';
import { ReactNode } from 'react';

type OffsetSectionProps = {
  children: ReactNode;
  bgColor?: 'bege-light' | 'bege-dark' | 'white' | 'green';
};

const innerSectionProps = variantProps({
  base: tw`-mx-4 xl:-mx-40`,
  variants: {
    bgColor: {
      'bege-light': tw`bg-bege-light`,
      'bege-dark': tw`bg-bege-dark`,
      white: tw`bg-white`,
      green: tw`bg-green`,
    },
  },
  defaultVariants: {
    bgColor: 'white',
  },
});

export const OffsetSection = (props: OffsetSectionProps) => {
  const { children } = props;
  return <div {...innerSectionProps({ ...props })}>{children}</div>;
};

import { ReactNode } from 'react';
import { tw, variantProps } from 'classname-variants/react';

type SectionProps = {
  children: ReactNode;
  width?: 'full' | 'half';
  bgcolor?: 'begeLight' | 'begeDark' | 'white' | 'green';
};

const innerSectionProps = variantProps({
  base: tw`px-4 lg:mx-auto lg:px-40`,
  variants: {
    width: {
      full: tw`w-full`,
      half: tw`w-1/2`,
    },
  },
  defaultVariants: { width: undefined },
});

const outerSectionProps = variantProps({
  variants: {
    bgcolor: {
      begeLight: tw`bg-bege-light`,
      begeDark: tw`bg-bege-dark`,
      white: tw`bg-white`,
      green: tw`bg-green`,
    },
  },
  defaultVariants: {
    bgcolor: 'white',
  },
});

export const Section = (props: SectionProps) => {
  const { children } = props;

  return (
    <section {...outerSectionProps({ ...props })}>
      <div {...innerSectionProps({ ...props })}>{children}</div>
    </section>
  );
};

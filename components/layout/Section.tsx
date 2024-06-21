import { ReactNode } from 'react';
import { tw, variantProps } from 'classname-variants/react';

type SectionProps = {
  children: ReactNode;
  width?: 'full' | 'half';
  bgcolor?: 'begeLight' | 'begeDark' | 'white' | 'green';
  padding?: 'none' | 'default';
};

const innerSectionProps = variantProps({
  variants: {
    width: {
      full: tw`w-full`,
      half: tw`w-1/2`,
    },
    padding: {
      none: tw`px-0`,
      default: tw`px-4 xl:px-40 xl:mx-auto`,
    },
  },
  defaultVariants: { width: undefined, padding: 'default' },
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

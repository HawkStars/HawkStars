import { tw, variantProps } from 'classname-variants/react';

type SectionProps = React.ComponentProps<'div'> & {
  width?: 'full' | 'half';
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

export const Section = (props: SectionProps) => {
  const { children } = props;

  return <section {...innerSectionProps({ ...props })}>{children}</section>;
};

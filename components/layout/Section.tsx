import { tw, variantProps } from 'classname-variants/react';

type SectionProps = React.ComponentProps<'div'> & {
  width?: 'full' | 'half';
  padding?: 'none' | 'default' | 'container';
  /**
   * Vertical rhythm, aligned with the `.section*` utilities in globals.css.
   * Defaults to `none` so existing call sites that set their own `py-*`
   * classes keep their current spacing.
   */
  spacing?: 'none' | 'tight' | 'default' | 'loose';
};

const innerSectionProps = variantProps({
  variants: {
    width: {
      full: tw`w-full`,
      half: tw`w-1/2`,
    },
    padding: {
      none: tw`px-0`,
      // Legacy wide-gutter layout used across the org pages.
      default: tw`px-4 xl:mx-auto xl:px-40`,
      // Standard responsive gutter, matches `.section-container`.
      container: tw`mx-auto px-4 sm:px-6 lg:px-8`,
    },
    spacing: {
      none: tw``,
      tight: tw`py-10 md:py-12 lg:py-16`,
      default: tw`py-16 md:py-20 lg:py-24`,
      loose: tw`py-20 md:py-28 lg:py-32`,
    },
  },
  defaultVariants: { width: undefined, padding: 'default', spacing: 'none' },
});

export const Section = (props: SectionProps) => {
  const { children } = props;

  return <section {...innerSectionProps({ ...props })}>{children}</section>;
};

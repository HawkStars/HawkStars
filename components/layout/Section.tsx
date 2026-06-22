import { forwardRef } from 'react';
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
  /**
   * When `true`, children are wrapped in a `<div className="section-container">`
   * so blocks don't need the extra wrapper themselves.
   */
  container?: boolean;
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
  base: tw`flex justify-center w-full`,
  defaultVariants: { width: undefined, padding: 'default', spacing: 'none' },
});

export const Section = forwardRef<HTMLElement, SectionProps>((props, ref) => {
  const { children, container, ...rest } = props;

  return (
    <section ref={ref} {...innerSectionProps({ ...rest })}>
      {container ? <div className='section-container'>{children}</div> : children}
    </section>
  );
});

Section.displayName = 'Section';

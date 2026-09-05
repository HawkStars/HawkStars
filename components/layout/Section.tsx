import { forwardRef } from 'react';
import { tw, variantProps } from 'classname-variants/react';

type SectionProps = React.ComponentProps<'div'> & {
  width?: 'full' | 'half';
  padding?: 'none' | 'default' | 'container';
  spacing?: 'none' | 'tight' | 'default' | 'loose';
  column?: 'none' | 'default';
  /**
   * When `true`, children are wrapped in a `<div className="section-container">`
   * so blocks don't need the extra wrapper themselves.
   */
  container?: boolean;
  /**
   * Content column width. `'content'` (the default) caps children at the
   * site's standard 72rem column so every section shares one left edge;
   * `'none'` lets a section run full-bleed — backgrounds, maps, hero images.
   */
  cap?: 'content' | 'none';
};

const innerSectionProps = variantProps({
  variants: {
    width: {
      full: tw`w-full`,
      half: tw`w-1/2`,
    },
    padding: {
      none: tw`px-0`,
      // One gutter scale for the whole site. This used to be
      // `px-4 xl:px-40`, which put sections 160px from the viewport at 1440
      // while the list and project pages sat at 144px — two grids, sixteen
      // pixels apart. `container` is kept as an alias for existing call sites.
      default: tw`mx-auto px-4 sm:px-6 lg:px-8`,
      container: tw`mx-auto px-4 sm:px-6 lg:px-8`,
    },
    spacing: {
      none: tw``,
      tight: tw`py-10 md:py-12 lg:py-16`,
      default: tw`py-16 md:py-20 lg:py-24`,
      loose: tw`py-20 md:py-28 lg:py-32`,
    },
    column: {
      none: tw``,
      default: tw`flex-col`,
    },
  },
  base: tw`flex justify-center w-full`,
  defaultVariants: { width: undefined, padding: 'default', spacing: 'none', column: 'none' },
});

export const Section = forwardRef<HTMLElement, SectionProps>((props, ref) => {
  const { children, container, cap = 'content', ...rest } = props;

  if (container) {
    return (
      <section ref={ref} {...innerSectionProps({ ...rest })}>
        <div className='section-container'>{children}</div>
      </section>
    );
  }

  return (
    <section ref={ref} {...innerSectionProps({ ...rest })}>
      {cap === 'content' ? <div className='w-full max-w-6xl'>{children}</div> : children}
    </section>
  );
});

Section.displayName = 'Section';

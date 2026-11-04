import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-green focus-visible:ring-green/40 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-green text-white shadow-sm hover:bg-green-dark hover:shadow-md',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border border-green text-green bg-white hover:bg-green/5 hover:text-green-dark dark:hover:text-green',
        secondary: 'bg-bege-dark text-green-dark hover:bg-bege-dark/70',
        // For CTAs sitting on a green (or other dark) background.
        inverse: 'bg-white text-green hover:bg-bege-light',
        'outline-inverse': 'border border-white/40 text-white hover:bg-white/10',
        ghost:
          'hover:bg-green/10 hover:text-green-dark dark:hover:bg-green/20 dark:hover:text-bege-dark',
        link: 'text-green underline-offset-4 hover:underline hover:text-green-dark',
        // Art Gallery sub-site (dark theme) — only for app/[lng]/(gallery) and components/art.
        art: 'rounded-none bg-art-gold-bright text-art-ebony hover:bg-art-gold focus-visible:ring-art-gold-bright/50',
        'art-outline':
          'rounded-none border border-art-gold/60 text-art-gold-bright hover:border-art-gold-bright hover:bg-art-gold-bright/10 focus-visible:ring-art-gold-bright/50',
        'art-ghost':
          'rounded-none px-0 text-art-gold-bright hover:text-art-text focus-visible:ring-art-gold-bright/50',
      },
      // Primary actions are at least 44px tall (lg/xl) so they are comfortable to tap.
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 rounded-md px-6 text-[0.9375rem] has-[>svg]:px-4',
        // Hero / page-level CTAs.
        xl: 'h-12 rounded-md px-8 text-base font-semibold has-[>svg]:px-6',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
        clear: '',
        art: 'min-h-11 px-6 py-3 font-art-sans text-xs font-semibold tracking-[0.15em] uppercase whitespace-normal text-center',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

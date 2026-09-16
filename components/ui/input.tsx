import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Unstyled-label input primitive. The accessible name is the caller's
 * responsibility: pair it with `<Label htmlFor={id}>` and give the input a
 * matching `id`.
 *
 * A11Y: do NOT reintroduce `aria-labelledby={name}`. `name` is a form field name,
 * not an element id, so that attribute pointed at nothing — and per ARIA a
 * dangling `aria-labelledby` resolves to an *empty* accessible name and
 * suppresses every other naming source, which is worse than omitting it. The
 * same bug was already fixed once in `components/utils/Input/Input.tsx:27-30`.
 * That component is the one to reach for when you want a labelled, translated
 * field with hint and error text; this one is the bare primitive.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring border-b-bege-dark flex h-10 w-full border-b-2 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };

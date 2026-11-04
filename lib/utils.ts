import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge reads any unknown `text-*` class as a text colour, so without this
// `cn('text-h2_semibold', 'text-black')` silently dropped the heading class. Registering
// the type-scale classes from globals.css as font sizes keeps them alongside colours
// while still letting a later `text-sm` (or another scale class) replace them.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'h1_semibold',
            'h2_semibold',
            'h2_bold',
            'h2_light',
            'h3_semibold',
            'body',
            'body_regular',
            'body_semibold',
            'eyebrow',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

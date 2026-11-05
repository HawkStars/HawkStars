import { cn } from '@/lib/utils';
import { StepsBlock } from '@/payload-types';

// Literal class names: Tailwind's scanner cannot see a class built by interpolation,
// so `lg:grid-cols-${n}` only ever worked because the literal existed in another file.
const stepsColumnClasses: Record<string, string> = {
  '1': 'lg:grid-cols-1',
  '2': 'lg:grid-cols-2',
  '3': 'lg:grid-cols-3',
  '4': 'lg:grid-cols-4',
  '5': 'lg:grid-cols-5',
};

// One tone per `dotColor`, built from design tokens (the old red/yellow were raw Tailwind
// palette colours). Blue keeps the Erasmus palette and serif face because the Erasmus page
// is where it is used; the other tones use the org type scale and warm dividers.
const toneStyles = {
  blue: {
    number: 'text-erasmus-blue/55 font-serif',
    dot: 'bg-erasmus-blue',
    divider: 'border-erasmus-blue/10',
    title: 'font-serif text-lg font-bold',
    body: 'text-erasmus-muted text-sm',
  },
  green: {
    number: 'text-green/70 font-display',
    dot: 'bg-green',
    divider: 'border-bege-dark',
    title: 'text-h3_semibold',
    body: 'text-body_regular text-black/70',
  },
  red: {
    number: 'text-terracotta/80 font-display',
    dot: 'bg-terracotta',
    divider: 'border-bege-dark',
    title: 'text-h3_semibold',
    body: 'text-body_regular text-black/70',
  },
  yellow: {
    // Gold on white is 2:1 — the dot carries the colour; the numeral stays legible.
    number: 'text-black/55 font-display',
    dot: 'bg-gold',
    divider: 'border-bege-dark',
    title: 'text-h3_semibold',
    body: 'text-body_regular text-black/70',
  },
} as const;

const StepsBlockComponent: React.FC<StepsBlock> = ({
  numberOfColumnsPerRow,
  steps,
  dotColor,
  sectionId,
  blockType = 'stepsBlock',
}) => {
  const tone = toneStyles[dotColor] ?? toneStyles.blue;

  return (
    <ol
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2',
        stepsColumnClasses[numberOfColumnsPerRow ?? '3']
      )}
      id={sectionId || undefined}
      data-block-type={blockType}
    >
      {steps.map((step, i) => (
        <li
          key={step.id || i}
          className={cn(
            'relative isolate px-4 py-10',
            i > 0 && cn('border-t lg:border-t-0 lg:border-l', tone.divider)
          )}
        >
          {/* Step number watermark, painted behind the text (it used to sit on top of long titles
              in narrow columns). The list order already conveys it to screen readers. */}
          <span
            aria-hidden='true'
            className={cn(
              'absolute top-6 right-6 -z-10 text-7xl leading-none font-black select-none',
              tone.number
            )}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <div aria-hidden='true' className={cn('mb-5 h-2.5 w-2.5 rounded-full', tone.dot)} />
          <h3 className={cn('mb-2', tone.title)}>{step.title}</h3>
          <p className={cn('max-w-prose leading-relaxed', tone.body)}>{step.description}</p>
        </li>
      ))}
    </ol>
  );
};

export default StepsBlockComponent;

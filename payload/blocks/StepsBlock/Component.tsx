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

const StepsBlockComponent: React.FC<StepsBlock> = ({
  numberOfColumnsPerRow,
  steps,
  dotColor,
  sectionId,
  blockType = 'stepsBlock',
}) => {
  return (
    <div
      className={cn([
        'grid grid-cols-1 sm:grid-cols-2',
        stepsColumnClasses[numberOfColumnsPerRow ?? '3'],
      ])}
      id={sectionId || undefined}
      data-block-type={blockType}
    >
      {steps.map((step, i) => {
        return (
          <div
            key={i}
            className={`relative px-4 py-10 ${i > 0 ? 'border-erasmus-blue/8 border-t lg:border-t-0 lg:border-l' : ''}`}
          >
            {/* Step number watermark */}
            <span
              className={cn('absolute top-6 right-6 font-serif text-7xl leading-none font-black', {
                'text-erasmus-blue/55': dotColor === 'blue',
                'text-red-500/80': dotColor === 'red',
                'text-green/70': dotColor === 'green',
                'text-yellow-700/75': dotColor === 'yellow',
              })}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div
              className={cn('mb-5 h-2.5 w-2.5 rounded-full', {
                'bg-erasmus-blue': dotColor === 'blue',
                'bg-green': dotColor === 'green',
                'bg-red-500': dotColor === 'red',
                'bg-yellow-500': dotColor === 'yellow',
              })}
            />
            <h3 className='mb-2 font-serif text-lg font-bold'>{step.title}</h3>
            <p className='text-erasmus-muted text-left text-sm leading-relaxed'>
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StepsBlockComponent;

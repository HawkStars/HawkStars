import { cn } from '@/lib/utils';
import { StepsBlock } from '@/payload-types';

const StepsBlockComponent: React.FC<StepsBlock> = ({
  numberOfColumnsPerRow,
  steps,
  sectionId,
  blockType,
}) => {
  return (
    <div
      className={cn(`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${numberOfColumnsPerRow} gap-8`)}
      data-testid={sectionId}
      data-block-type={blockType}
    >
      {steps.map((step, i) => (
        <div
          key={step.id}
          className={`relative px-4 py-10 ${i > 0 ? 'border-erasmus-blue/8 border-t lg:border-t-0 lg:border-l' : ''}`}
        >
          {/* Step number watermark */}
          <span className='text-erasmus-blue/[0.07] absolute top-6 right-6 font-serif text-7xl leading-none font-black'>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className='bg-erasmus-blue mb-5 h-2.5 w-2.5 rounded-full' />
          <h4 className='mb-2 font-serif text-lg font-bold'>{step.title}</h4>
          <p className='text-erasmus-muted text-sm leading-relaxed'>{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default StepsBlockComponent;

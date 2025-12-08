import * as LucideIcons from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

import type { CardGridBlock as CardGridBlockProps } from '@/payload-types';

type Props = CardGridBlockProps;

const CardGridBlock: React.FC<Props> = ({ title, features, buttonText, buttonUrl }) => {
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as unknown as Record<string, React.ComponentType>)[
      iconName
    ] as LucideIcons.LucideIcon;
    if (!Icon) {
      console.warn(`Icon "${iconName}" not found in lucide-react`);
      return null;
    }
    return <Icon className='size-6' />;
  };

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section className='py-32'>
      <div className='container mx-auto'>
        {title && (
          <div className='mx-auto mb-16 max-w-3xl text-center'>
            <h2 className='text-4xl font-medium text-pretty lg:text-5xl'>{title}</h2>
          </div>
        )}
        <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, i) => (
            <div key={i} className='flex flex-col'>
              <div className='bg-accent mb-5 flex size-16 items-center justify-center rounded-full'>
                {getIcon(feature.icon)}
              </div>
              <h3 className='mb-2 text-xl font-semibold'>{feature.heading}</h3>
              <p className='text-muted-foreground'>{feature.description}</p>
            </div>
          ))}
        </div>
        {buttonUrl && buttonText && (
          <div className='mt-16 flex justify-center'>
            <Button size='lg' asChild>
              <a href={buttonUrl}>{buttonText}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export { CardGridBlock };

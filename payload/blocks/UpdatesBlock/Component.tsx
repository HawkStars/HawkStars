'use client';

import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { UpdatesBlock as UpdatesBlockType } from '@/payload-types';

const UpdatesBlockComponent: React.FC<UpdatesBlockType> = ({
  heading,
  description,
  categories,
  latestUpdates,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categoryNames = ['All', ...(categories?.map((cat) => cat.name) ?? [])];

  const filteredUpdates =
    selectedCategory === 'All'
      ? latestUpdates
      : latestUpdates?.filter((update) => update.category === selectedCategory);

  return (
    <section className='py-32'>
      <div className='container mx-auto'>
        {heading && <h1 className='text-4xl font-medium sm:text-6xl md:text-7xl'>{heading}</h1>}
        {description && <p className='text-muted-foreground mt-4 text-lg'>{description}</p>}
        <div className='mt-24'>
          <h2 className='mb-6 text-2xl font-medium md:text-3xl'>Latest updates</h2>
          <Tabs
            defaultValue='All'
            className='border-border border-b'
            onValueChange={setSelectedCategory}
          >
            <TabsList className='bg-background flex h-auto gap-2 p-0'>
              {categoryNames.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className='group relative py-2.5 uppercase data-[state=active]:shadow-none'
                >
                  {category}
                  <span className='group-data-[state=active]:bg-primary absolute -bottom-px group-data-[state=active]:h-px group-data-[state=active]:w-full' />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className='mt-4'>
            {filteredUpdates?.map((update, idx) => (
              <a
                key={idx}
                href={update.link}
                className='border-border flex flex-col justify-between gap-4 border-b py-6 md:flex-row'
              >
                <h3 className='font-medium md:line-clamp-1'>{update.title}</h3>
                <div className='flex w-full shrink-0 grid-cols-3 justify-between gap-2 md:grid md:max-w-80'>
                  <p className='text-muted-foreground text-sm'>{update.category}</p>
                  <time className='text-muted-foreground text-sm'>{update.date}</time>
                  <div className='hidden items-center justify-end -space-x-2 md:flex'>
                    {update.authors?.map((author, i) => (
                      <Avatar key={i} className='border-border size-6 border'>
                        <AvatarImage src={author.avatar} />
                      </Avatar>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { UpdatesBlockComponent };

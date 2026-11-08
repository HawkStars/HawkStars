import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { timelineKeys } from './config';
import { Reveal } from '@/components/ui/motion';
import type { HomeT } from './types';

/**
 * Vertical on mobile, horizontal from `lg`. The connecting rule is a `Reveal`
 * that grows from the start edge, so the line "draws" as the section enters.
 */
export const HomeTimeline = ({ t }: { t: HomeT }) => (
  <HawkStarsSection spacing='loose' className='bg-white'>
    <Reveal>
      <SectionHeader
        eyebrow={t('timeline.eyebrow')}
        title={t('timeline.title')}
        align='center'
        className='mb-16'
      />
    </Reveal>

    <div className='relative'>
      <Reveal
        from='draw'
        className='bg-green/20 absolute top-0 bottom-0 left-[1.1rem] w-0.5 origin-top lg:top-[1.1rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-0.5 lg:w-full lg:origin-left'
      />

      <ol className='relative grid gap-10 lg:grid-cols-5 lg:gap-6'>
        {timelineKeys.map((key, i) => {
          const last = i === timelineKeys.length - 1;
          return (
            <Reveal as='li' key={key} delay={200 + i * 180} className='flex gap-5 lg:flex-col'>
              <span
                className={
                  last
                    ? 'bg-gold text-ink ring-gold/30 relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-8'
                    : 'bg-green relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ring-8 ring-white'
                }
              >
                {i + 1}
              </span>
              <div>
                <p className='text-h2_semibold text-terracotta-dark'>
                  {t(`timeline.items.${key}.year`)}
                </p>
                <h3 className='text-h3_semibold text-green mt-1'>
                  {t(`timeline.items.${key}.title`)}
                </h3>
                <p className='mt-2 text-sm leading-relaxed text-black/70'>
                  {t(`timeline.items.${key}.description`)}
                </p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </div>
  </HawkStarsSection>
);

import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { ImageMedia } from '@/payload/components/Media';
import { missionImage, valueKeys } from './config';
import { Reveal } from '@/components/ui/motion';
import type { HomeT } from './types';

export const HomeMission = ({ t }: { t: HomeT }) => (
  <HawkStarsSection id='mission' spacing='loose' className='scroll-mt-20 bg-white'>
    <div className='grid items-center gap-14 lg:grid-cols-2 lg:gap-20'>
      <div>
        <Reveal>
          <SectionHeader eyebrow={t('mission.eyebrow')} title={t('mission.title')} />
        </Reveal>
        <Reveal delay={150}>
          <p className='text-body_regular mt-6 leading-relaxed text-black/75'>
            {t('mission.body')}
          </p>
          <p className='text-body_regular mt-4 leading-relaxed text-black/75'>
            {t('mission.body_2')}
          </p>
        </Reveal>

        <Reveal delay={250}>
          <h3 className='text-eyebrow text-green mt-12 mb-5'>{t('mission.values_title')}</h3>
        </Reveal>
        <ol className='flex flex-col gap-3'>
          {valueKeys.map((key, i) => (
            <Reveal as='li' key={key} delay={300 + i * 120} from='left'>
              <div className='group bg-bege-light hover:bg-green flex items-center gap-5 rounded-xl p-5 transition-colors duration-300'>
                <span className='text-h2_semibold text-green/30 transition-colors group-hover:text-white/40'>
                  0{i + 1}
                </span>
                <div>
                  <p className='text-h3_semibold text-green transition-colors group-hover:text-white'>
                    {t(`mission.values.${key}.title`)}
                  </p>
                  <p className='text-sm text-black/70 transition-colors group-hover:text-white/85'>
                    {t(`mission.values.${key}.description`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal from='right' className='relative'>
        <div className='bg-bege-dark absolute -top-6 -right-6 hidden size-40 rounded-xl lg:block' />
        <div className='border-green absolute -bottom-6 -left-6 hidden size-32 rounded-xl border-2 lg:block' />
        <div className='relative aspect-3/2 overflow-hidden rounded-xl shadow-md'>
          <ImageMedia
            src={missionImage}
            alt={t('mission.image_alt')}
            fill
            sizes='(min-width: 1024px) 50vw, 100vw'
            className='object-cover transition-transform duration-[2s] hover:scale-110'
          />
        </div>
      </Reveal>
    </div>
  </HawkStarsSection>
);

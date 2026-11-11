import { TFunction } from 'i18next';
import { LuGraduationCap, LuMagnet, LuNetwork } from 'react-icons/lu';
import { CfSection, Container, Glow, Highlight, SectionEyebrow } from './ui';

type Props = { t: TFunction<string, string> };

/** The three commitments of the GV-ITC (campaign post "Serviços do GV-ITC", Jul 2026). */
const COMMITMENTS = [
  { key: 'empower', Icon: LuGraduationCap },
  { key: 'attract', Icon: LuMagnet },
  { key: 'connect', Icon: LuNetwork },
] as const;

/** Hawk Stars track record (Global Village 2026 presentation, §1). */
const TRACK_RECORD = ['founded', 'youth', 'nationalities', 'partners'] as const;

const CrowdfundingAbout = ({ t }: Props) => (
  <CfSection id='about'>
    <Glow className='top-1/3 -left-60 size-120 opacity-20' />
    <Container>
      <div className='grid gap-10 lg:grid-cols-2 lg:gap-16'>
        <div className='flex flex-col gap-5'>
          <SectionEyebrow>{t('about.badge')}</SectionEyebrow>
          <h2 className='text-h2_semibold text-white'>
            {t('about.title_prefix')} <Highlight>{t('about.title_highlight')}</Highlight>
          </h2>
        </div>
        <div className='text-crowdfunding-muted flex flex-col gap-4 text-base leading-relaxed lg:pt-10'>
          <p>{t('about.description')}</p>
          <p>{t('about.description_2')}</p>
        </div>
      </div>

      <ul className='mt-14 grid gap-4 md:grid-cols-3'>
        {COMMITMENTS.map(({ key, Icon }, index) => (
          <li
            key={key}
            className='bg-crowdfunding-surface border-crowdfunding-line hover:border-crowdfunding-accent/40 relative flex flex-col gap-3 rounded-xl border p-6 transition-colors'
          >
            <div className='flex items-center justify-between'>
              <span className='bg-crowdfunding-accent/10 text-crowdfunding-accent flex size-11 items-center justify-center rounded-full'>
                <Icon aria-hidden='true' className='size-5' />
              </span>
              <span
                aria-hidden='true'
                className='font-display text-3xl font-semibold text-white/10'
              >
                0{index + 1}
              </span>
            </div>
            <h3 className='text-h3_semibold text-white'>{t(`about.commitments.${key}.title`)}</h3>
            <p className='text-crowdfunding-muted text-sm leading-relaxed'>
              {t(`about.commitments.${key}.description`)}
            </p>
          </li>
        ))}
      </ul>

      <dl className='border-crowdfunding-line mt-14 grid grid-cols-2 gap-y-8 border-y py-8 lg:grid-cols-4'>
        {TRACK_RECORD.map((key) => (
          <div key={key} className='flex flex-col-reverse gap-1 px-2 text-center'>
            <dt className='text-crowdfunding-muted text-sm'>
              {t(`about.track_record.${key}.label`)}
            </dt>
            <dd className='font-display text-crowdfunding-accent text-4xl font-semibold lg:text-5xl'>
              {t(`about.track_record.${key}.value`)}
            </dd>
          </div>
        ))}
      </dl>
    </Container>
  </CfSection>
);

export default CrowdfundingAbout;

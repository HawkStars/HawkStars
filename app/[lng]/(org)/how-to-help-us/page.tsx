import { getMetadataPageInfo } from '@/utils/metadata';
import type { IconType } from 'react-icons';
import {
  LuGlobe,
  LuGraduationCap,
  LuHandshake,
  LuHeartHandshake,
  LuLandmark,
  LuPlane,
} from 'react-icons/lu';
import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { HawkStarsSection, PageHero } from '@/components/layout';
import { Button } from '@/components/ui/button';
import StepsBlockComponent from '@/payload/blocks/StepsBlock/Component';
import { steps } from './config';
import { SectionEyebrow } from '@/components/ui/SectionHeader';

const CONTACT_EMAIL = 'geral@hawkstars.org';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'how_to_help_us');
  return metadataPage;
}

const HowToHelpUsPage = async (props: LanguagePageProps) => {
  const { lng } = await props.params;
  return <HowToHelpUsContent lng={lng} />;
};

// `getServerTranslation` resolves a dynamic `import()` of the locale JSON, which
// under `cacheComponents` counts as uncached data reached outside a boundary and
// makes the whole route blocking. Static content keyed only on `lng`, so cached.
async function HowToHelpUsContent({ lng }: { lng: string }) {
  const { t } = await getServerTranslation(lng as Language, 'how-to-help-us');

  return (
    <>
      <HeroSection t={t} />
      <WhyJoinSection t={t} />
      <PathsSection t={t} />
      <HowItWorksSection t={t} />
      <CTASection t={t} />
    </>
  );
}

export default HowToHelpUsPage;

// ── Types ──

type T = (key: string) => string;

// ── Hero ──

const HeroSection = ({ t }: { t: T }) => (
  <PageHero
    variant='green'
    align='center'
    eyebrow={t('hero_eyebrow')}
    title={
      <>
        {t('hero_title_pre')} <span className='text-bege-dark'>{t('hero_title_highlight')}</span>
      </>
    }
    description={t('hero_description')}
    actions={
      <>
        <Button asChild variant='inverse' size='xl'>
          <a href='#paths'>{t('hero_cta_explore')}</a>
        </Button>
        <Button asChild variant='outline-inverse' size='xl'>
          <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('email_subject'))}`}>
            {t('hero_cta_contact')}
          </a>
        </Button>
      </>
    }
  />
);

// ── Why Join ──

const whyReasons = [
  { icon: LuGlobe, titleKey: 'why_impact_title', descKey: 'why_impact_desc' },
  { icon: LuHandshake, titleKey: 'why_community_title', descKey: 'why_community_desc' },
  { icon: LuGraduationCap, titleKey: 'why_growth_title', descKey: 'why_growth_desc' },
  { icon: LuPlane, titleKey: 'why_europe_title', descKey: 'why_europe_desc' },
] as const;

const WhyJoinSection = ({ t }: { t: T }) => (
  <HawkStarsSection spacing='default'>
    <div>
      <SectionTag label={t('why_tag')} />
      <h2 className='text-h1_semibold mb-5 text-black'>{t('why_title')}</h2>
      <p className='mb-14 max-w-xl text-base leading-relaxed text-black/70'>{t('why_lead')}</p>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        {whyReasons.map((reason) => (
          <div
            key={reason.titleKey}
            className='bg-bege-light group flex gap-5 rounded-lg p-8 transition-shadow hover:shadow-md'
          >
            <span className='text-green flex size-12 shrink-0 items-center justify-center rounded-full bg-white'>
              <reason.icon aria-hidden='true' className='size-6' />
            </span>
            <div>
              <h3 className='text-body_semibold text-green mb-1'>{t(reason.titleKey)}</h3>
              <p className='text-sm leading-relaxed text-black/70'>{t(reason.descKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </HawkStarsSection>
);

// ── Paths: Member vs Volunteer ──

const PathsSection = ({ t }: { t: T }) => (
  <HawkStarsSection id='paths' spacing='default' className='bg-bege-light'>
    <div>
      <SectionTag label={t('paths_tag')} />
      <h2 className='text-h1_semibold mb-14 text-black'>{t('paths_title')}</h2>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Member card */}
        <PathCard
          t={t}
          icon={LuLandmark}
          titleKey='member_title'
          descKey='member_desc'
          perks={['member_perk1', 'member_perk2', 'member_perk3', 'member_perk4']}
          ctaKey='member_cta'
          emailSubjectKey='member_email_subject'
        />

        {/* Volunteer card */}
        <PathCard
          t={t}
          icon={LuHeartHandshake}
          titleKey='volunteer_title'
          descKey='volunteer_desc'
          perks={['volunteer_perk1', 'volunteer_perk2', 'volunteer_perk3', 'volunteer_perk4']}
          ctaKey='volunteer_cta'
          emailSubjectKey='volunteer_email_subject'
        />
      </div>
    </div>
  </HawkStarsSection>
);

const PathCard = ({
  t,
  icon: Icon,
  titleKey,
  descKey,
  perks,
  ctaKey,
  emailSubjectKey,
}: {
  t: T;
  icon: IconType;
  titleKey: string;
  descKey: string;
  perks: string[];
  ctaKey: string;
  emailSubjectKey: string;
}) => (
  <div className='group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg'>
    {/* Top accent bar */}
    <div className='bg-green h-1.5 w-full' />

    <div className='flex flex-1 flex-col p-8 lg:p-10'>
      <span className='bg-bege-light text-green mb-5 flex size-14 items-center justify-center rounded-full'>
        <Icon aria-hidden='true' className='size-7' />
      </span>
      <h3 className='text-h2_bold mb-3 text-black'>{t(titleKey)}</h3>
      <p className='mb-8 text-sm leading-relaxed text-black/70'>{t(descKey)}</p>

      {/* Perks list */}
      <div className='mb-8 flex flex-col gap-3'>
        {perks.map((perkKey) => (
          <div key={perkKey} className='flex items-start gap-3'>
            <span className='text-green mt-0.5 shrink-0 text-sm'>&#10003;</span>
            <span className='text-sm text-black/80'>{t(perkKey)}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button asChild size='xl' className='mt-auto w-full'>
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t(emailSubjectKey))}`}>
          {t(ctaKey)}
        </a>
      </Button>
    </div>
  </div>
);

// ── How It Works ──

const HowItWorksSection = ({ t }: { t: T }) => (
  <HawkStarsSection spacing='default'>
    <div>
      <SectionTag label={t('how_tag')} />
      <h2 className='text-h1_semibold mb-14 text-black'>{t('how_title')}</h2>

      <StepsBlockComponent
        numberOfColumnsPerRow={'3'}
        dotColor={'green'}
        steps={steps.map((step) => ({
          ...step,
          title: t(step.title),
          description: t(step.description),
        }))}
        blockType={'stepsBlock'}
      />
    </div>
  </HawkStarsSection>
);

// ── CTA Banner ──

const CTASection = ({ t }: { t: T }) => (
  <PageHero
    variant='green'
    align='center'
    size='compact'
    as='h2'
    title={t('cta_title')}
    description={t('cta_description')}
    actions={
      <Button asChild variant='inverse' size='xl'>
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('email_subject'))}`}>
          {t('cta_button')}
        </a>
      </Button>
    }
  >
    <p className='mt-6 text-center text-sm text-white/90'>{CONTACT_EMAIL}</p>
  </PageHero>
);

// ── Shared ──

const SectionTag = ({ label }: { label: string }) => (
  <SectionEyebrow label={label} variant='green' />
);

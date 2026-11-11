import { LuHeart, LuMapPin, LuPlay, LuUsers } from 'react-icons/lu';
import { TFunction } from 'i18next';
import { Language } from '@/i18n/settings';
import { CrowdfundingSetting } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { Button } from '@/components/ui/button';
import { Container, Glow, ProgressBar } from './ui';
import { formatEuro } from '@/lib/utils/currency';
import { getPercentage, WORKS_START_AMOUNT } from './utils';

type Props = { t: TFunction<string, string>; lng: Language } & Pick<
  CrowdfundingSetting,
  | 'raisedAmount'
  | 'campaignGoal'
  | 'projectGoal'
  | 'heroImage'
  | 'lastUpdateDate'
  | 'supportUrl'
  | 'videoUrl'
  | 'supporters'
>;

const FALLBACK_HERO = '/images/training_center/exterior1.jpg';

const CrowdfundingHero = ({
  t,
  raisedAmount,
  campaignGoal,
  projectGoal,
  heroImage,
  lastUpdateDate,
  supportUrl,
  videoUrl,
  supporters,
  lng,
}: Props) => {
  const raised = raisedAmount ?? 0;
  const percentage = getPercentage(raised, campaignGoal);
  const supporterCount = supporters?.length ?? 0;
  const markers =
    campaignGoal && WORKS_START_AMOUNT < campaignGoal
      ? [
          {
            at: (WORKS_START_AMOUNT / campaignGoal) * 100,
            label: t('hero.stats.works_marker', { amount: formatEuro(WORKS_START_AMOUNT, lng) }),
          },
        ]
      : [];

  return (
    <section className='bg-crowdfunding-bg relative isolate w-full overflow-hidden'>
      <div className='absolute inset-0 -z-10'>
        <ImageMedia
          resource={typeof heroImage === 'object' && heroImage ? heroImage : FALLBACK_HERO}
          alt=''
          fill
          preload
          sizes='100vw'
          className='object-cover opacity-35'
        />
        <div className='from-crowdfunding-bg via-crowdfunding-bg/85 to-crowdfunding-bg/30 absolute inset-0 bg-linear-to-r' />
        <div className='from-crowdfunding-bg absolute inset-x-0 bottom-0 h-40 bg-linear-to-t to-transparent' />
      </div>
      <Glow className='-top-40 -right-40 size-144' />
      <Glow className='-bottom-60 -left-40 size-112 opacity-20' />

      <Container className='grid gap-12 py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:py-28'>
        <div className='flex flex-col gap-6'>
          <p className='text-eyebrow text-crowdfunding-accent flex items-center gap-2'>
            <LuMapPin aria-hidden='true' className='size-4' />
            {t('hero.badge')}
          </p>

          <h1 className='text-display text-white'>
            {t('hero.title_prefix')}{' '}
            <span className='text-crowdfunding-accent'>Global Village</span>{' '}
            {t('hero.title_suffix')}
          </h1>

          <p className='text-h2_light text-crowdfunding-muted max-w-xl'>{t('hero.subtitle')}</p>

          <div className='flex flex-wrap gap-3 pt-2'>
            <Button asChild variant='crowdfunding' size='xl'>
              <a
                href={supportUrl || '#rewards'}
                target={supportUrl ? '_blank' : undefined}
                rel='noopener noreferrer'
              >
                <LuHeart aria-hidden='true' />
                {t('hero.cta_support')}
              </a>
            </Button>
            {videoUrl ? (
              <Button asChild variant='crowdfunding-outline' size='xl'>
                <a href='#video'>
                  <LuPlay aria-hidden='true' />
                  {t('hero.cta_video')}
                </a>
              </Button>
            ) : (
              <Button asChild variant='crowdfunding-outline' size='xl'>
                <a href='#rewards'>{t('hero.cta_rewards')}</a>
              </Button>
            )}
          </div>

          <p className='text-crowdfunding-muted max-w-xl text-sm'>{t('hero.disclaimer')}</p>
        </div>

        {/* Funding card */}
        <div className='bg-crowdfunding-surface/80 border-crowdfunding-line relative rounded-xl border p-6 shadow-lg backdrop-blur-md lg:p-8'>
          <p className='text-eyebrow text-crowdfunding-muted'>{t('hero.stats.raised_label')}</p>
          <p className='font-display mt-2 text-5xl font-semibold text-white lg:text-6xl'>
            {formatEuro(raised, lng)}
          </p>
          <p className='text-crowdfunding-muted mt-2 text-sm'>
            {t('hero.stats.of_goal', {
              percentage,
              goal: formatEuro(campaignGoal ?? 0, lng),
            })}
          </p>

          <div className='mt-6 mb-10'>
            <ProgressBar
              percentage={percentage}
              markers={markers}
              label={t('hero.stats.progress_label')}
            />
          </div>

          <dl className='border-crowdfunding-line grid grid-cols-2 gap-x-4 gap-y-5 border-t pt-6'>
            <div>
              <dt className='text-crowdfunding-muted text-xs'>
                {t('hero.stats.campaign_goal_label')}
              </dt>
              <dd className='mt-1 text-lg font-semibold text-white'>
                {formatEuro(campaignGoal ?? 0, lng)}
              </dd>
            </div>
            <div>
              <dt className='text-crowdfunding-muted text-xs'>
                {t('hero.stats.project_goal_label')}
              </dt>
              <dd className='mt-1 text-lg font-semibold text-white'>
                {formatEuro(projectGoal ?? 0, lng)}
              </dd>
            </div>
            {supporterCount > 0 && (
              <div>
                <dt className='text-crowdfunding-muted text-xs'>
                  {t('hero.stats.supporters_label')}
                </dt>
                <dd className='mt-1 flex items-center gap-2 text-lg font-semibold text-white'>
                  <LuUsers aria-hidden='true' className='text-crowdfunding-accent size-4' />
                  {supporterCount}
                </dd>
              </div>
            )}
            {lastUpdateDate && (
              <div>
                <dt className='text-crowdfunding-muted text-xs'>
                  {t('hero.stats.last_update_label')}
                </dt>
                <dd className='mt-1 text-lg font-semibold text-white'>{lastUpdateDate}</dd>
              </div>
            )}
          </dl>
        </div>
      </Container>
    </section>
  );
};

export default CrowdfundingHero;

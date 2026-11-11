import { TFunction } from 'i18next';
import { LuBuilding2, LuHeart, LuMail, LuMapPin, LuTrophy } from 'react-icons/lu';
import { CrowdfundingSetting } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CfSection, Container, Glow, Highlight, SectionEyebrow } from './ui';

type Props = { t: TFunction<string, string> } & Pick<
  CrowdfundingSetting,
  'supportUrl' | 'rewardTiers'
>;

const ICONS = {
  heart: LuHeart,
  building: LuBuilding2,
  location: LuMapPin,
  trophy: LuTrophy,
} as const;

const STEPS = ['step1', 'step2', 'step3'] as const;

/** Address donors write to in order to claim a reward (rewards catalogue 2026, last page). */
const FUNDRAISING_EMAIL = 'fundraising@hawkstars.org';

const CrowdfundingRewards = ({ t, supportUrl, rewardTiers }: Props) => {
  const tiers = rewardTiers ?? [];

  return (
    <CfSection id='rewards' alt>
      <Glow className='-top-40 left-1/3 size-136 opacity-20' />
      <Container>
        <div className='mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
          <div className='flex max-w-2xl flex-col gap-5'>
            <SectionEyebrow>{t('rewards.badge')}</SectionEyebrow>
            <h2 className='text-h2_semibold text-white'>
              {t('rewards.title_prefix')} <Highlight>{t('rewards.title_highlight')}</Highlight>
            </h2>
          </div>
          <p className='text-crowdfunding-muted max-w-md text-sm leading-relaxed'>
            {t('rewards.description')}
          </p>
        </div>

        {tiers.length > 0 && (
          <Tabs defaultValue='tier-0' className='gap-6'>
            <TabsList className='h-auto w-full justify-start gap-2 overflow-x-auto rounded-none bg-transparent p-0'>
              {tiers.map((tier, index) => {
                const Icon = ICONS[tier.icon ?? 'heart'] ?? LuHeart;
                return (
                  <TabsTrigger
                    key={tier.id ?? index}
                    value={`tier-${index}`}
                    className='border-crowdfunding-line text-crowdfunding-muted data-[state=active]:border-crowdfunding-accent data-[state=active]:bg-crowdfunding-accent/10 focus-visible:ring-crowdfunding-accent/50 h-11 flex-none cursor-pointer rounded-full border px-5 hover:text-white data-[state=active]:text-white data-[state=active]:shadow-none'
                  >
                    <Icon aria-hidden='true' />
                    {tier.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tiers.map((tier, index) => (
              <TabsContent
                key={tier.id ?? index}
                value={`tier-${index}`}
                forceMount
                className='data-[state=inactive]:hidden'
              >
                <div className='bg-crowdfunding-surface border-crowdfunding-line rounded-xl border p-6 lg:p-8'>
                  <div className='mb-6 flex flex-col gap-1'>
                    <h3 className='text-h2_bold text-white'>{tier.title}</h3>
                    {tier.subtitle && <p className='text-crowdfunding-muted'>{tier.subtitle}</p>}
                  </div>
                  <ul className='grid gap-x-8 md:grid-cols-2'>
                    {(tier.items ?? []).map((item, itemIndex) => (
                      <li
                        key={item.id ?? itemIndex}
                        className='border-crowdfunding-line flex items-baseline gap-4 border-t py-4'
                      >
                        <span className='font-display text-crowdfunding-accent w-24 shrink-0 text-xl font-semibold'>
                          {item.price || '—'}
                        </span>
                        <span className='text-sm leading-relaxed text-white/85'>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        <div className='mt-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center'>
          <div>
            <h3 className='text-eyebrow text-crowdfunding-muted'>{t('rewards.how_to_badge')}</h3>
            <ol className='mt-4 grid gap-4 md:grid-cols-3'>
              {STEPS.map((step, index) => (
                <li key={step} className='flex items-start gap-3'>
                  <span className='border-crowdfunding-accent text-crowdfunding-accent flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold'>
                    {index + 1}
                  </span>
                  <p className='pt-1 text-sm text-white/85'>
                    {t(`rewards.steps.${step}`, { email: FUNDRAISING_EMAIL })}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div className='flex flex-wrap gap-3'>
            <Button asChild variant='crowdfunding' size='lg'>
              <a
                href={supportUrl || '#support'}
                target={supportUrl ? '_blank' : undefined}
                rel='noopener noreferrer'
              >
                <LuHeart aria-hidden='true' />
                {t('rewards.cta_all')}
              </a>
            </Button>
            <Button asChild variant='crowdfunding-outline' size='lg'>
              <a href={`mailto:${FUNDRAISING_EMAIL}`}>
                <LuMail aria-hidden='true' />
                {t('rewards.cta_claim')}
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </CfSection>
  );
};

export default CrowdfundingRewards;

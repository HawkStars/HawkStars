import { TFunction } from 'i18next';
import Link from 'next/link';
import {
  LuArrowRight,
  LuBadgeCheck,
  LuBuilding2,
  LuHandCoins,
  LuInfo,
  LuPalette,
  LuShoppingBag,
  LuSprout,
} from 'react-icons/lu';
import { Language } from '@/i18n/settings';
import { cn } from '@/lib/utils';
import { CrowdfundingSetting } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { CfSection, Container, Glow, Highlight, SectionEyebrow } from './ui';

type Props = { t: TFunction<string, string>; lng: Language } & Pick<
  CrowdfundingSetting,
  'businessCtaUrl'
>;

const BENEFITS = [
  { key: 'impact', Icon: LuSprout },
  { key: 'reputation', Icon: LuBadgeCheck },
  { key: 'transparency', Icon: LuBuilding2 },
] as const;

/**
 * Ways to support outside the crowdfunding platform ("Lista de Rewards Doadores",
 * May 2026). The online shop has no public URL yet, so it renders without a link.
 */
const OTHER_WAYS = [
  { key: 'gallery', Icon: LuPalette, path: SITE_GET_URLS.gallery },
  { key: 'shop', Icon: LuShoppingBag, path: null },
  { key: 'direct', Icon: LuHandCoins, path: SITE_GET_URLS.contribute },
] as const;

const CrowdfundingBusiness = ({ businessCtaUrl, t, lng }: Props) => (
  <CfSection id='business'>
    <Glow className='-top-20 -left-40 size-120 opacity-25' />
    <Container>
      <div className='bg-crowdfunding-surface border-crowdfunding-line relative overflow-hidden rounded-xl border p-6 lg:p-12'>
        <Glow className='-right-32 -bottom-32 size-80 opacity-30' />
        <div className='relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16'>
          <div className='flex flex-col gap-5'>
            <SectionEyebrow>{t('business.badge')}</SectionEyebrow>
            <h2 className='text-h2_semibold text-white'>
              {t('business.title_prefix')} <Highlight>{t('business.title_highlight')}</Highlight>
            </h2>
            <p className='text-crowdfunding-muted leading-relaxed'>{t('business.description')}</p>
            <Button asChild variant='crowdfunding' size='lg' className='w-fit'>
              <a href={businessCtaUrl || 'mailto:fundraising@hawkstars.org'}>{t('business.cta')}</a>
            </Button>
          </div>

          <ul className='flex flex-col gap-6'>
            {BENEFITS.map(({ key, Icon }) => (
              <li key={key} className='flex gap-4'>
                <span className='bg-crowdfunding-accent/10 text-crowdfunding-accent flex size-11 shrink-0 items-center justify-center rounded-full'>
                  <Icon aria-hidden='true' className='size-5' />
                </span>
                <div>
                  <h3 className='font-semibold text-white'>
                    {t(`business.benefits.${key}.title`)}
                  </h3>
                  <p className='text-crowdfunding-muted mt-1 text-sm leading-relaxed'>
                    {t(`business.benefits.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className='border-crowdfunding-line text-crowdfunding-muted relative mt-10 flex items-start gap-3 border-t pt-6 text-xs leading-relaxed'>
          <LuInfo aria-hidden='true' className='mt-0.5 size-4 shrink-0' />
          {t('business.disclaimer')}
        </p>
      </div>

      <div className='mt-16'>
        <h3 className='text-h2_bold text-white'>{t('other_ways.title')}</h3>
        <p className='text-crowdfunding-muted mt-2 max-w-2xl text-sm'>
          {t('other_ways.description')}
        </p>
        <ul className='mt-8 grid gap-4 md:grid-cols-3'>
          {OTHER_WAYS.map(({ key, Icon, path }) => {
            const content = (
              <>
                <Icon aria-hidden='true' className='text-crowdfunding-accent size-6' />
                <span className='font-display text-crowdfunding-accent text-3xl font-semibold'>
                  {t(`other_ways.items.${key}.figure`)}
                </span>
                <span className='font-semibold text-white'>
                  {t(`other_ways.items.${key}.title`)}
                </span>
                <span className='text-crowdfunding-muted text-sm leading-relaxed'>
                  {t(`other_ways.items.${key}.description`)}
                </span>
                {path && (
                  <span className='text-crowdfunding-accent mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold'>
                    {t(`other_ways.items.${key}.cta`)}
                    <LuArrowRight
                      aria-hidden='true'
                      className='size-4 transition-transform group-hover:translate-x-1'
                    />
                  </span>
                )}
              </>
            );
            const cardClass =
              'group bg-crowdfunding-surface-alt border-crowdfunding-line flex h-full flex-col gap-2 rounded-xl border p-6 transition-colors';
            return (
              <li key={key}>
                {path ? (
                  <Link
                    href={transformUrl(lng, path)}
                    className={cn(cardClass, 'hover:border-crowdfunding-accent/40')}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className={cardClass}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Container>
  </CfSection>
);

export default CrowdfundingBusiness;

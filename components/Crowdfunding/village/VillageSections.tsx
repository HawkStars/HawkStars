import { TFunction } from 'i18next';
import {
  LuBriefcase,
  LuBuilding2,
  LuCheck,
  LuGraduationCap,
  LuHourglass,
  LuMapPin,
  LuQuote,
  LuSparkles,
  LuTrendingDown,
} from 'react-icons/lu';
import { ImageMedia } from '@/payload/components/Media';
import { ImageComparisonSlider } from '@/components/ui/image-comparison-slider-horizontal';
import { getImagePayloadUrl } from '@/lib/image';
import { cn } from '@/lib/utils';
import type { WhyHereWhyNowBlock } from '@/payload-types';
import { CfSection, Container, Glow, SectionEyebrow } from '../ui';
import { splitEmoji, splitProse, VillageSections } from './utils';

type T = { t: TFunction<string, string> };

/** Section heading pair used by every Village section on this page. */
const Heading = ({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow: string;
  title?: string | null;
  subtitle?: string | null;
  center?: boolean;
}) => (
  <div
    className={cn('flex max-w-3xl flex-col gap-4', center && 'mx-auto items-center text-center')}
  >
    <SectionEyebrow>{eyebrow}</SectionEyebrow>
    {title && <h2 className='text-h2_semibold text-white'>{title}</h2>}
    {subtitle && <p className='text-h2_light text-crowdfunding-muted'>{subtitle}</p>}
  </div>
);

export const VillageManifesto = ({ block, t }: T & { block: VillageSections['manifesto'] }) => {
  if (!block) return null;
  const [lead, ...rest] = block.text.split('\n').filter(Boolean);
  return (
    <CfSection id='project'>
      <Glow className='top-10 -right-60 size-120 opacity-20' />
      <Container className='grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16'>
        <div className='flex flex-col gap-5'>
          <SectionEyebrow>{t('village.manifesto')}</SectionEyebrow>
          <p className='text-h2_bold text-white'>{lead}</p>
        </div>
        <div className='text-crowdfunding-muted flex flex-col gap-4 text-base leading-relaxed lg:pt-10'>
          {rest.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </CfSection>
  );
};

export const VillageComparisonSection = ({
  block,
  t,
}: T & { block: VillageSections['comparison'] }) => {
  const before = getImagePayloadUrl(block?.beforeImage);
  const after = getImagePayloadUrl(block?.afterImage);
  if (!block || !before?.url || !after?.url) return null;
  return (
    <CfSection alt>
      <Container className='flex flex-col gap-10'>
        <Heading eyebrow={t('village.comparison')} title={block.title} center />
        <div className='border-crowdfunding-line overflow-hidden rounded-2xl border'>
          <ImageComparisonSlider
            leftImage={before.url}
            rightImage={after.url}
            altLeft={before.alt ?? block.beforeLabel ?? t('village.before')}
            altRight={after.alt ?? block.afterLabel ?? t('village.after')}
            className='aspect-video'
          />
        </div>
        <div className='text-crowdfunding-muted flex justify-between text-sm font-semibold uppercase'>
          <span>← {block.beforeLabel || t('village.before')}</span>
          <span className='text-crowdfunding-accent'>
            {block.afterLabel || t('village.after')} →
          </span>
        </div>
      </Container>
    </CfSection>
  );
};

/** Icons for the "why here" tiles whose label carries no figure, in CMS order. */
const CHALLENGE_ICONS = [LuTrendingDown, LuHourglass, LuGraduationCap, LuBriefcase] as const;
/** Icons for the "what we have" cards, in CMS order. The first is the location card. */
const OPPORTUNITY_ICONS = [LuMapPin, LuBuilding2, LuSparkles] as const;

/** "39,4% da população…" → "39,4%". Undefined when the label has no percentage. */
const figureOf = (label: string) => label.match(/\d+(?:[.,]\d+)?\s?%/)?.[0];

/** Header shared by both "why" sections: eyebrow + title on the left, badge on the right. */
const ChallengeHeader = ({ block, eyebrow }: { block: WhyHereWhyNowBlock; eyebrow: string }) => (
  <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-end'>
    <Heading eyebrow={eyebrow} title={splitEmoji(block.title).label} subtitle={block.subtitle} />
    {block.badge && (
      <span className='border-crowdfunding-accent/40 text-crowdfunding-accent w-fit shrink-0 rounded-full border px-4 py-2 text-sm font-semibold italic'>
        {block.badge}
      </span>
    )}
  </div>
);

/** "Why here? Why now?" — the region's figures as large stat tiles. */
export const VillageChallenges = ({
  block,
  eyebrow,
}: {
  block?: WhyHereWhyNowBlock;
  eyebrow: string;
}) => {
  if (!block) return null;
  return (
    <CfSection id='why-here'>
      <Glow className='-top-40 -left-60 size-120 opacity-20' />
      <Container className='flex flex-col gap-12'>
        <ChallengeHeader block={block} eyebrow={eyebrow} />
        <ul className='border-crowdfunding-line grid border-t sm:grid-cols-2 lg:grid-cols-4'>
          {block.challenges.map((item, index) => {
            const figure = figureOf(item.label);
            const Icon = CHALLENGE_ICONS[index % CHALLENGE_ICONS.length];
            return (
              <li
                key={item.id ?? item.label}
                className='border-crowdfunding-line group relative flex flex-col gap-4 border-b py-8 sm:px-6 sm:odd:border-r lg:border-r lg:border-b-0 lg:first:pl-0 lg:last:border-r-0'
              >
                <span
                  aria-hidden='true'
                  className='bg-crowdfunding-accent absolute -top-px left-0 h-0.5 w-12 sm:left-6 lg:group-first:left-0'
                />
                {figure ? (
                  <span className='font-display text-crowdfunding-accent text-5xl font-semibold lg:text-6xl'>
                    {figure}
                  </span>
                ) : (
                  <span className='text-crowdfunding-accent flex h-12 items-center lg:h-15'>
                    <Icon aria-hidden='true' className='size-10' />
                  </span>
                )}
                <p className='text-base leading-relaxed text-white'>{item.label}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </CfSection>
  );
};

/** "This needs to happen now!" — what the territory does have, as numbered icon cards. */
export const VillageOpportunities = ({
  block,
  eyebrow,
  t,
}: T & {
  block?: WhyHereWhyNowBlock;
  eyebrow: string;
}) => {
  if (!block) return null;
  return (
    <CfSection alt>
      <Container className='flex flex-col gap-12'>
        <ChallengeHeader block={block} eyebrow={eyebrow} />
        <ul className='grid gap-4 md:grid-cols-3'>
          {block.challenges.map((item, index) => {
            const Icon = OPPORTUNITY_ICONS[index % OPPORTUNITY_ICONS.length];
            return (
              <li
                key={item.id ?? item.label}
                className='bg-crowdfunding-surface border-crowdfunding-line hover:border-crowdfunding-accent/40 flex flex-col gap-5 rounded-xl border p-6 transition-colors'
              >
                <div className='flex items-center justify-between'>
                  <span className='bg-crowdfunding-accent/10 text-crowdfunding-accent flex size-12 items-center justify-center rounded-full'>
                    <Icon aria-hidden='true' className='size-6' />
                  </span>
                  <span
                    aria-hidden='true'
                    className='font-display text-3xl font-semibold text-white/10'
                  >
                    0{index + 1}
                  </span>
                </div>
                <p className='text-h3_semibold text-white'>{item.label}</p>
                {index === 0 && (
                  <span className='text-crowdfunding-accent mt-auto flex items-center gap-1.5 text-sm font-semibold'>
                    <LuMapPin aria-hidden='true' className='size-4' />
                    {t('village.location')}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </CfSection>
  );
};

export const VillageProposal = ({ block, t }: T & { block: VillageSections['proposal'] }) => {
  if (!block) return null;
  const { paragraphs, items } = splitProse(block.description.root);
  return (
    <CfSection id='proposal'>
      <Glow className='-bottom-40 -left-40 size-112 opacity-25' />
      <Container className='grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16'>
        <div className='flex flex-col gap-6'>
          <Heading eyebrow={t('village.proposal')} title={block.title} />
          <div className='text-crowdfunding-muted flex flex-col gap-2 text-base leading-relaxed'>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className='grid gap-3 sm:grid-cols-2'>
            {items.map((item) => (
              <li key={item} className='flex items-start gap-3 text-sm text-white'>
                <span className='bg-crowdfunding-accent/15 text-crowdfunding-accent mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full'>
                  <LuCheck aria-hidden='true' className='size-3' />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className='border-crowdfunding-line relative aspect-4/3 overflow-hidden rounded-2xl border'>
          <ImageMedia
            resource={block.image}
            alt={getImagePayloadUrl(block.image)?.alt ?? block.title}
            fill
            sizes='(min-width: 1024px) 50vw, 100vw'
            className='object-cover'
          />
        </div>
      </Container>
    </CfSection>
  );
};

export const VillageVision = ({ block, t }: T & { block: VillageSections['vision'] }) => {
  if (!block) return null;
  return (
    <CfSection alt id='vision'>
      <Container className='flex flex-col gap-12'>
        <Heading eyebrow={t('village.vision')} title={block.title} />
        <ol className='relative grid gap-6 lg:grid-cols-3'>
          <span
            aria-hidden='true'
            className='from-crowdfunding-accent-strong to-crowdfunding-accent/0 absolute top-5 right-0 left-0 hidden h-px bg-linear-to-r lg:block'
          />
          {block.phases.map((phase, index) => (
            <li key={phase.id ?? phase.phaseName} className='relative flex flex-col gap-4'>
              <span className='bg-crowdfunding-accent-strong font-display relative z-10 flex size-10 items-center justify-center rounded-full font-semibold text-white ring-8 ring-(--color-crowdfunding-surface-alt)'>
                {index + 1}
              </span>
              <div className='bg-crowdfunding-surface border-crowdfunding-line flex flex-1 flex-col gap-4 rounded-xl border p-6'>
                <h3 className='text-h3_semibold text-crowdfunding-accent'>{phase.phaseName}</h3>
                <ul className='flex flex-col gap-2.5'>
                  {phase.items.map((item) => (
                    <li
                      key={item.id ?? item.text}
                      className='text-crowdfunding-muted flex gap-2.5 text-sm leading-relaxed'
                    >
                      <span
                        aria-hidden='true'
                        className='bg-crowdfunding-accent mt-2 size-1.5 shrink-0 rounded-full'
                      />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </CfSection>
  );
};

export const VillageGallery = ({ block, t }: T & { block: VillageSections['gallery'] }) => {
  if (!block?.images.length) return null;
  const images = block.images.slice(0, 5);
  return (
    <CfSection id='gallery'>
      <Container className='flex flex-col gap-10'>
        <Heading eyebrow={t('village.gallery')} title={block.title} subtitle={block.description} />
        <ul className='grid auto-rows-[160px] grid-cols-2 gap-3 lg:auto-rows-[200px] lg:grid-cols-4'>
          {images.map((item, index) => (
            <li
              key={item.id ?? index}
              className={cn(
                'border-crowdfunding-line group relative overflow-hidden rounded-xl border',
                index === 0 && 'col-span-2 row-span-2'
              )}
            >
              <ImageMedia
                resource={item.image}
                alt={getImagePayloadUrl(item.image)?.alt ?? ''}
                fill
                sizes={index === 0 ? '(min-width: 1024px) 50vw, 100vw' : '25vw'}
                className='object-cover transition-transform duration-500 group-hover:scale-105'
              />
            </li>
          ))}
        </ul>
      </Container>
    </CfSection>
  );
};

export const VillageImpact = ({ block, t }: T & { block: VillageSections['impact'] }) => {
  if (!block) return null;
  const title = splitEmoji(block.title).label;
  return (
    <CfSection alt id='impact'>
      <Glow className='top-1/2 -right-40 size-120 opacity-20' />
      <Container className='flex flex-col gap-12'>
        <Heading eyebrow={t('village.impact')} title={title} center />
        <dl className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          {block.rows.map((row) => {
            const { emoji, label } = splitEmoji(row.columnOne);
            return (
              <div
                key={row.id ?? row.columnOne}
                className='bg-crowdfunding-surface border-crowdfunding-line flex flex-col gap-3 rounded-xl border p-6'
              >
                <dt className='text-crowdfunding-accent flex items-center gap-2 text-sm font-semibold uppercase'>
                  {emoji && <span aria-hidden='true'>{emoji}</span>}
                  {label}
                </dt>
                <dd className='text-sm leading-relaxed text-white'>{row.columnTwo}</dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </CfSection>
  );
};

export const VillageQuote = ({
  join,
  quote,
  t,
}: T & { join: VillageSections['join']; quote: VillageSections['quote'] }) => {
  if (!join && !quote) return null;
  return (
    <CfSection>
      <Glow className='top-0 left-1/2 size-144 -translate-x-1/2 opacity-25' />
      <Container className='flex flex-col items-center gap-10 text-center'>
        {join && (
          <Heading eyebrow={t('village.join')} title={join.title} subtitle={join.subtitle} center />
        )}
        {quote && (
          <figure className='border-crowdfunding-line flex max-w-3xl flex-col items-center gap-5 border-t pt-10'>
            <LuQuote aria-hidden='true' className='text-crowdfunding-accent size-8' />
            <blockquote className='text-h2_bold text-white'>“{quote.quote}”</blockquote>
            <figcaption className='text-crowdfunding-muted text-sm'>— {quote.author}</figcaption>
          </figure>
        )}
      </Container>
    </CfSection>
  );
};

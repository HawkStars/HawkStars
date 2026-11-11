import React from 'react';
import { LuDownload } from 'react-icons/lu';
import type { PageHeroBlock as PageHeroBlockProps } from '@/payload-types';
import { PageHero } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Language } from '@/i18n/settings';
import { getLinkFieldInformation } from '@/utils/page';

type Tone = 'green' | 'bege';

/** Button variants per band: [primary, secondary]. */
const BUTTONS = {
  green: ['inverse', 'outline-inverse'],
  bege: ['default', 'outline'],
} as const;

const FACT_TILE: Record<Tone, string> = {
  green: 'bg-green-dark',
  bege: 'bg-white shadow-sm',
};
const FACT_LABEL: Record<Tone, string> = {
  green: 'text-white/90',
  bege: 'text-black/60',
};

const DEFAULT_DOWNLOAD_LABEL: Record<Language, string> = {
  pt: 'Descarregar (PDF)',
  en: 'Download (PDF)',
};

export const PageHeroBlock: React.FC<PageHeroBlockProps & { lng: Language }> = ({
  eyebrow,
  title,
  description,
  variant,
  align,
  links,
  document,
  documentLabel,
  facts,
  sectionId,
  lng,
}) => {
  const tone: Tone = variant ?? 'green';
  const download = document && typeof document === 'object' && document.url ? document.url : null;

  const buttons = [
    ...(download
      ? [
          {
            url: download,
            label: documentLabel || DEFAULT_DOWNLOAD_LABEL[lng],
            newTab: true,
            isDownload: true,
          },
        ]
      : []),
    ...(links ?? []).flatMap(({ link }) => {
      const info = getLinkFieldInformation(link, lng);
      return info?.url && info.label
        ? [{ url: info.url, label: info.label, newTab: Boolean(info.newTab), isDownload: false }]
        : [];
    }),
  ].slice(0, 2);

  return (
    <div id={sectionId || undefined} data-blockid='pageHero'>
      <PageHero
        variant={tone}
        align={align ?? 'left'}
        eyebrow={eyebrow ?? undefined}
        title={title}
        description={description}
        actions={
          buttons.length > 0
            ? buttons.map((button, index) => (
                <Button key={button.url} asChild variant={BUTTONS[tone][index]} size='xl'>
                  <a
                    href={button.url}
                    target={button.newTab ? '_blank' : undefined}
                    rel={button.newTab ? 'noopener noreferrer' : undefined}
                  >
                    {button.isDownload && <LuDownload aria-hidden='true' className='size-5' />}
                    {button.label}
                  </a>
                </Button>
              ))
            : undefined
        }
      >
        {facts && facts.length > 0 && (
          <dl className='relative mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4'>
            {facts.map((fact, index) => (
              <div
                key={fact.id || index}
                className={cn('flex flex-col gap-1 rounded-xl p-4', FACT_TILE[tone])}
              >
                <dt className={cn('text-xs', FACT_LABEL[tone])}>{fact.label}</dt>
                <dd className='text-body_semibold'>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </PageHero>
    </div>
  );
};

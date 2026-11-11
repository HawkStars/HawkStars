import React from 'react';
import type { ContactChannelsBlock as ContactChannelsBlockProps } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { getIcon } from '@/lib/icon';
import { cn } from '@/lib/utils';
import { Language } from '@/i18n/settings';
import { isLinkUrl } from '@/utils/paths';

const TONE = {
  ink: {
    section: 'bg-ink text-white',
    header: 'inverse',
    subtitle: 'text-white/85',
    card: 'bg-white/10 hover:bg-white/20',
    icon: 'text-ink bg-white',
    label: 'text-white/75',
  },
  green: {
    section: 'bg-green text-white',
    header: 'inverse',
    subtitle: 'text-white/85',
    card: 'bg-white/10 hover:bg-white/20',
    icon: 'text-green bg-white',
    label: 'text-white/75',
  },
  bege: {
    section: 'bg-bege-light text-black',
    header: 'green',
    subtitle: undefined,
    card: 'bg-white shadow-sm hover:shadow-md',
    icon: 'bg-green text-white',
    label: 'text-black/60',
  },
} as const;

/** Site paths get the locale; contact schemes and URLs pass through. */
const resolveHref = (href: string, lng: Language) =>
  href.startsWith('/') ? `/${lng}${href}` : isLinkUrl(href) ? href : undefined;

export const ContactChannelsBlock: React.FC<ContactChannelsBlockProps & { lng: Language }> = ({
  eyebrow,
  title,
  description,
  background,
  channels,
  sectionId,
  lng,
}) => {
  if (!channels || channels.length === 0) return null;
  const tone = TONE[background ?? 'ink'];

  return (
    <HawkStarsSection
      spacing='default'
      className={tone.section}
      id={sectionId || undefined}
      data-blockid='contactChannels'
    >
      <div className='grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16'>
        <SectionHeader
          reveal
          variant={tone.header}
          eyebrow={eyebrow}
          title={title}
          subtitle={description}
          subtitleClassName={tone.subtitle}
        />
        <ul className='flex flex-col gap-3'>
          {channels.map((channel, index) => {
            const href = resolveHref(channel.href, lng);
            const external = href?.startsWith('http');
            return (
              <li key={channel.id || index}>
                <a
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'flex items-center gap-4 rounded-xl p-5 transition-colors',
                    tone.card
                  )}
                >
                  <span
                    aria-hidden='true'
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center rounded-full',
                      tone.icon
                    )}
                  >
                    {getIcon(channel.icon)}
                  </span>
                  <span className='flex flex-col'>
                    <span className={cn('text-sm', tone.label)}>{channel.label}</span>
                    <span className='text-h2_bold break-all'>{channel.value}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </HawkStarsSection>
  );
};

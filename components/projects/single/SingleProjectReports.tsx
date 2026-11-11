'use client';

import { FlagIcon } from '@/lib/icon';
import { HawkProject, Partner } from '@/payload-types';
import { LuArrowUpRight } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { ImageMedia } from '@/payload/components/Media';
import { coFoundedEuropeanLogoBlue } from '@/utils/models/images/logos';
import { FC } from 'react';
import { ContentSection } from '@/components/layout';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { GoLink } from 'react-icons/go';
import { IconType } from 'react-icons';
import { FLAG_PORTUGAL } from '@/lib/constants';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';
import SectionHeader from '@/components/ui/SectionHeader';

const ICONS = {
  tiktok: FaTiktok,
  facebook: FaFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  twitter: FaTwitter,
  website: GoLink,
  other: GoLink,
} as const;

type DisseminationLinkProps = {
  url?: string | null;
  label?: string | null;
  platform?: keyof typeof ICONS | null;
};

/** One outbound report/post link: platform icon + label, as an outline button. */
const DisseminationLink = ({ url, label, platform }: DisseminationLinkProps) => {
  if (!url) return null;
  const Icon: IconType = platform ? ICONS[platform] : LuArrowUpRight;
  return (
    <Button asChild variant='outline' size='sm'>
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={label ? undefined : (platform ?? url)}
      >
        <Icon aria-hidden='true' />
        {label}
      </a>
    </Button>
  );
};

type SingleProjectReportsProps = Pick<
  HawkProject,
  'otherDisseminationFields' | 'partnersInformation' | 'hawkStarsInformation'
> & { lng?: Language };

const SingleProjectReports: FC<SingleProjectReportsProps> = ({
  otherDisseminationFields,
  partnersInformation,
  hawkStarsInformation,
  lng: lngProp,
}) => {
  const cookieLng = useLanguageCookie();
  const { t } = useTranslation(lngProp ?? cookieLng, 'projects');
  const { partners } = partnersInformation || {};
  const { documents } = hawkStarsInformation || {};
  const { reports } = otherDisseminationFields || {};

  if (
    (!partners || partners.length === 0) &&
    (!documents || documents.length === 0) &&
    (!reports || reports.length === 0)
  ) {
    return null;
  }

  const hawkDocs = documents?.filter((doc) => doc.url) ?? [];
  const rows = [
    ...(hawkDocs.length > 0 ? [{ key: 'hawk', country: FLAG_PORTUGAL, links: hawkDocs }] : []),
    ...(partners ?? [])
      .map((p) => ({
        key: p.id ?? (p.partner as Partner).id,
        country: (p.partner as Partner).country,
        links: (p.reports ?? []).filter((report) => report.url),
      }))
      .filter((row) => row.links.length > 0),
  ];

  return (
    <ContentSection>
      <SectionHeader title={t('sections.dissemination')} className='mb-8' />
      <div className='flex flex-col gap-4'>
        {rows.map((row) => (
          <div
            key={row.key}
            className='card border-bege-dark flex flex-col gap-4 border bg-white p-5 sm:flex-row sm:items-center'
          >
            <FlagIcon country={row.country} />
            <div className='flex flex-wrap gap-2'>
              {row.links.map((link, j) => (
                <DisseminationLink key={link.id ?? j} {...link} />
              ))}
            </div>
          </div>
        ))}

        <div className='bg-bege-light flex flex-col gap-5 rounded-xl p-5 sm:flex-row sm:items-center'>
          <ImageMedia
            src={coFoundedEuropeanLogoBlue}
            alt={t('a11y.euFunded')}
            width={180}
            className='h-auto w-44 shrink-0'
          />
          {reports && reports.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {reports.map((report, j) => (
                <DisseminationLink key={report.id ?? j} url={report.url} label={report.label} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ContentSection>
  );
};

export default SingleProjectReports;

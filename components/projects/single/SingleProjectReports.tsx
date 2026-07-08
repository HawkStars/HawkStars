import { FlagIcon } from '@/lib/icon';
import { HawkProject, Partner } from '@/payload-types';
import Link from 'next/link';
import Image from 'next/image';
import { coFoundedEuropeanLogoBlue } from '@/utils/models/images/logos';
import { FC } from 'react';
import { ProjectSection } from '../utils/ProjectSection';
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

type SingleProjectReportsProps = Pick<
  HawkProject,
  'otherDisseminationFields' | 'partnersInformation' | 'hawkStarsInformation'
>;

const SingleProjectReports: FC<SingleProjectReportsProps> = ({
  otherDisseminationFields,
  partnersInformation,
  hawkStarsInformation,
}) => {
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

  return (
    <ProjectSection className='bg-bege-dark'>
      <h2 className='mb-8 text-4xl font-bold'>Disseminação</h2>
      <div className='flex flex-col gap-3'>
        {partners?.map((p) => {
          const partner = p.partner as Partner;
          const reports = p.reports || [];

          if (!reports || reports.length === 0) return null;

          return (
            <div className='space-y-4' key={p.id}>
              <div key={partner.id} className='flex gap-4 max-lg:flex-col'>
                <FlagIcon country={partner.country} />
                <div className='flex flex-wrap gap-2'>
                  {reports &&
                    reports.map((report, j) => {
                      const { url, label, platform } = report;
                      if (!url) return null;
                      const Icon = platform ? (ICONS[platform] as IconType) : null;

                      return (
                        <Link
                          key={j}
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='rounded-full bg-amber-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500'
                        >
                          {label ? <span>{label}</span> : Icon ? <Icon size={24} /> : null}
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}
        {hawkStarsInformation && (
          <>
            <div className='flex gap-4 max-lg:flex-col'>
              <FlagIcon country={FLAG_PORTUGAL} />
              {hawkStarsInformation.documents?.map((doc, j) => {
                const { url, label, platform } = doc;
                if (!url) return null;
                const Icon = platform ? (ICONS[platform] as IconType) : null;

                return (
                  <Link
                    key={j}
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='rounded-full bg-amber-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500'
                  >
                    {label ? <span>{label}</span> : Icon ? <Icon size={24} /> : null}
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <div className='flex flex-wrap gap-3'>
          <div className='relative aspect-auto h-auto w-40'>
            <Image
              className='absolute'
              src={coFoundedEuropeanLogoBlue}
              alt='Co-founded by the European Union'
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>

          {otherDisseminationFields?.reports?.map((report, j) => (
            <Link
              key={j}
              href={report.url}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full bg-amber-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500'
            >
              {report.label}
            </Link>
          ))}
        </div>
      </div>
    </ProjectSection>
  );
};

export default SingleProjectReports;

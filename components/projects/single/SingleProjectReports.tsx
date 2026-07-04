import { FlagIcon } from '@/lib/icon';
import { HawkProject, Partner } from '@/payload-types';
import Link from 'next/link';
import Image from 'next/image';
import { coFoundedEuropeanLogoBlue } from '@/utils/models/images/logos';
import { FC } from 'react';
import { ProjectSection } from '../utils/ProjectSection';

type SingleProjectReportsProps = Pick<
  HawkProject,
  'otherDisseminationFields' | 'partnersInformation'
>;

const SingleProjectReports: FC<SingleProjectReportsProps> = ({
  otherDisseminationFields,
  partnersInformation,
}) => {
  const { partners } = partnersInformation || {};
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

                      return (
                        <Link
                          key={j}
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='rounded-full bg-amber-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500'
                        >
                          {label ||
                            `Disseminação via ${platform?.charAt(0)?.toUpperCase() + platform?.slice(1)}`}
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}

        <div className='flex flex-wrap gap-3'>
          <div className='relative aspect-auto h-auto w-40'>
            <Image
              className='absolute'
              src={coFoundedEuropeanLogoBlue}
              alt='Co-founded by the European Union'
              fill
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

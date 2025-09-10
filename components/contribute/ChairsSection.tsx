'use client';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { type JSX } from 'react';
import { Trans } from 'react-i18next';
import Accordion from '../utils/Accordion/Accordion';
import { Contribution } from '@/payload-types';

type ChairsSectionsProps = {
  title: string;
  price?: string;
  icon: JSX.Element;
  iconFilled: JSX.Element;
  size: number;
  currentContributions: Contribution[];
};

const ChairsSections = ({
  title,
  price,
  icon,
  iconFilled,
  size,
  currentContributions = [],
}: ChairsSectionsProps) => {
  const missingContributionsLength = size - currentContributions.length;
  const missingContributionsChairs = Array(missingContributionsLength).fill(null);
  return (
    <>
      <div className='mx-2 my-10 flex flex-col justify-center gap-1 max-lg:px-2 lg:mx-0 lg:gap-3'>
        <h6 className='lg:text-h2_light text-body_semibold mt-5 lg:text-center'>{title}</h6>
        {price && (
          <span className='text-body_semibold text-green font-black lg:text-center'>{price}</span>
        )}
        <ContributionsChairsDesktop
          icon={icon}
          iconFilled={iconFilled}
          currentContributions={currentContributions}
          missingContributionsChairs={missingContributionsChairs}
        />
        <ContributionsChairsMobile currentContributions={currentContributions} size={size} />
      </div>
    </>
  );
};

type ContributionInfoSectionProps = {
  icon: JSX.Element;
  contributor?: string;
};

const ContributionInfoSection = ({ icon, contributor }: ContributionInfoSectionProps) => {
  return (
    <div className='group'>
      {icon}
      {contributor && (
        <div className='bg-bege-dark absolute bottom-0 -left-12 z-50 hidden w-40 max-w-md p-2 text-center group-hover:block'>
          {contributor}
        </div>
      )}
    </div>
  );
};

type ContributionsChairDesktopProps = Pick<
  ChairsSectionsProps,
  'icon' | 'iconFilled' | 'currentContributions'
> & {
  missingContributionsChairs: Array<any>;
};

const ContributionsChairsDesktop = ({
  currentContributions,
  missingContributionsChairs,
  iconFilled,
  icon,
}: ContributionsChairDesktopProps) => {
  return (
    <div className='mx-auto mt-5 flex w-full flex-wrap justify-center gap-5 max-md:hidden md:w-full lg:w-2/3'>
      {currentContributions.map((contribution: Contribution) => {
        return (
          <ContributionInfoSection
            key={contribution?.id}
            contributor={contribution?.donor}
            icon={iconFilled}
          />
        );
      })}
      {missingContributionsChairs.map((_, index) => {
        return <ContributionInfoSection key={index} icon={icon} />;
      })}
    </div>
  );
};

type ContributionsChairsMobileProps = Pick<ChairsSectionsProps, 'currentContributions'> & {
  size: number;
};

const ContributionsChairsMobile = ({
  currentContributions,
  size,
}: ContributionsChairsMobileProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');

  return (
    <div className='flex flex-col gap-2 md:hidden'>
      <Trans
        i18nKey={'brand.chairs.available_chairs'}
        t={t}
        values={{ taken: currentContributions.length, all: size }}
      />
      {currentContributions.length > 0 && (
        <Accordion title={t('contributor')}>
          {currentContributions.map((contribution) => {
            return contribution.donor ? (
              <div key={contribution.id} className='flex w-full justify-between'>
                <span>{contribution.donor}</span>
                <span>{contribution.contribution_date || ''}</span>
              </div>
            ) : (
              <></>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default ChairsSections;

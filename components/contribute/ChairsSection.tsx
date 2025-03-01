import { getServerTranslation } from '@/i18n';
import { Contribution } from '@/projects/sanity/sanity.types';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import type { JSX } from 'react';
import { Trans } from 'react-i18next';

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
      <div className='my-10 flex flex-col justify-center gap-3 lg:mx-0'>
        <h6 className='text-h2_light mt-5 text-center'>{title}</h6>
        {price && (
          <span className='text-body_semibold text-center font-black text-green'>{price}</span>
        )}
        <ContributionsChairsDesktop
          icon={icon}
          iconFilled={iconFilled}
          currentContributions={currentContributions}
          missingContributionsChairs={missingContributionsChairs}
        />
        <ContributionsChairsMobile
          currentContributions={currentContributions}
          missingContributionsLength={missingContributionsLength}
        />
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
        <div className='absolute -left-12 bottom-0 z-50 hidden w-40 max-w-md bg-bege-dark p-2 text-center group-hover:block'>
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
            key={contribution?._id}
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
  missingContributionsLength: number;
};

const ContributionsChairsMobile = async ({
  currentContributions,
  missingContributionsLength,
}: ContributionsChairsMobileProps) => {
  const lng = useLanguageCookie();
  const { t } = await getServerTranslation(lng, 'contribute');

  return (
    <div className='mx-auto flex flex-col md:hidden'>
      <Trans
        i18nKey={'available_chairs'}
        t={t}
        components={{
          global: <span className=''>The Global Village</span>,
          international: <span className=''>International Training Center</span>,
        }}
      />
      <p></p>
      <p className='text-center'>{currentContributions.length}</p>
      <p className='text-center'>{missingContributionsLength}</p>
    </div>
  );
};

export default ChairsSections;

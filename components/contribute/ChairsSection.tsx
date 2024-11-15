import { Contribution } from '@/models/database';

import type { JSX } from "react";

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
      <div className='my-10 hidden flex-col justify-center gap-3 lg:mx-0 lg:flex'>
        <h3 className='mt-5 text-center'>{title}</h3>
        {price && <h4 className='text-center font-black text-green'>{price}</h4>}
        <div className='mx-auto mt-5 flex w-full flex-wrap justify-center gap-5 lg:w-2/3'>
          {currentContributions.map((contribution) => {
            return (
              <ContributionInfoSection
                key={contribution.id}
                contributor={contribution.donor}
                icon={iconFilled}
              />
            );
          })}
          {missingContributionsChairs.map((_, index) => {
            return <ContributionInfoSection key={index} icon={icon} />;
          })}
        </div>
      </div>
      <div className='my-10 flex flex-col justify-center gap-5 lg:hidden'>
        <div className='flex flex-col gap-2 text-center'>
          <h3 className='text-center'>{title}</h3>
          {price && <h4 className='font-black text-green'>{price}</h4>}
        </div>
        <div className='flex flex-row gap-5 mx-auto'>
          <div className='flex flex-col gap-2'>
            {iconFilled}
            <p className='text-center'>{currentContributions.length}</p>
          </div>
          <div className='flex flex-col gap-2'>
            {icon}
            <p className='text-center'>{missingContributionsLength}</p>
          </div>
        </div>
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
    <div className='group relative'>
      {icon}
      {contributor && (
        <div className='absolute -left-12 bottom-0 z-50 hidden w-40 max-w-md bg-bege-dark p-2 text-center text-sm group-hover:block'>
          {contributor}
        </div>
      )}
    </div>
  );
};

export default ChairsSections;

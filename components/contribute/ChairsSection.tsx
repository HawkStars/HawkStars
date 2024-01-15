import { Contribution } from '@/models/database';

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
  const missingContributions = Array(size - currentContributions.length).fill(null);

  return (
    <div className='my-10 flex flex-col justify-center gap-3 lg:mx-0'>
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
        {missingContributions.map((item, index) => {
          return <ContributionInfoSection key={index} icon={icon} />;
        })}
      </div>
    </div>
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

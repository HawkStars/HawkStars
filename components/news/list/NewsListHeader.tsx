import { HawkStarsSection } from '@/components/layout';

type NewsListHeaderProps = {
  title: string;
  subtitle?: string | null;
};

const NewsListHeader = ({ title, subtitle }: NewsListHeaderProps) => {
  return (
    <HawkStarsSection className='bg-bege-light py-10 lg:py-14'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-h1_semibold'>{title}</h1>
        <p className='lg:text-h2_light text-body_regular'>{subtitle}</p>
      </div>
    </HawkStarsSection>
  );
};

export default NewsListHeader;

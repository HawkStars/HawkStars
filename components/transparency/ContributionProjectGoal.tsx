'use client';

import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { useTranslation } from '@/i18n/client';
import MainHawkStarsLoading from '@/app/[lng]/(org)/loading';
import dynamic from 'next/dynamic';

export const PROJECT_GOAL = 900000;

const ContributionProgressBar = dynamic(
  () => import('@/components/transparency/ContributionProgressBar'),
  { loading: () => <MainHawkStarsLoading />, ssr: false }
);

const ContributionProjectGoal = ({ sumContributions }: { sumContributions: number }) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'transparency');

  return (
    <div className='bg-bege-light flex flex-col gap-4 px-8 py-8 lg:px-40 lg:py-20'>
      <h2 className='lg:text-h1_semibold text-h2_bold text-green text-center'>
        {t('current_goal')}
      </h2>
      <h6 className='lg:text-h2_light mt-1 text-center'>{`${t('goal')}: ${PROJECT_GOAL}€`}</h6>
      <ContributionProgressBar sumContributions={sumContributions} projectGoal={PROJECT_GOAL} />
    </div>
  );
};

export default ContributionProjectGoal;

'use client';

import { useEffect, useState } from 'react';
import { getTotalMoneyGathered } from '@/server/contribution';
// import { useLanguageCookie } from '@/hooks/useLanguageCookie';
import { useLanguageCookie } from '@/contexts/AppProvider';
import { useTranslation } from '@/i18n/client';

export const PROJECT_GOAL = 900000;

const ContributionProjectGoal = () => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'transparency');
  const [totalContribution, setTotalContribution] = useState<number>(0);
  const normalizedGoal = (totalContribution || 0) / PROJECT_GOAL;
  const goalAsPercentage = (normalizedGoal * 100).toFixed(2);
  const loadingWidth = Math.round((window?.innerWidth || 0) * normalizedGoal) + 'px';

  const getCurrentProjetContribution = async () => {
    const moneyGathered = await getTotalMoneyGathered();
    setTotalContribution(moneyGathered || 0);
  };

  useEffect(() => {
    getCurrentProjetContribution();
  }, []);

  return (
    <div className='flex flex-col gap-1 bg-bege-light px-8 py-8 lg:px-40 lg:py-20'>
      <h2 className='text-center text-green'>{t('current_goal')}</h2>
      <h6 className='mt-1 text-center font-black'>{`${t('goal')}: ${PROJECT_GOAL}€`}</h6>
      <div className='rounded-xs relative mt-5 h-6 w-full border border-green'>
        <div
          className={`h-full bg-gradient-to-r from-bege-dark from-10% to-bege-light to-95%`}
          style={{ width: loadingWidth }}
        >
          <p className='absolute my-auto flex w-full justify-center text-sm'>
            {totalContribution}€ ({goalAsPercentage}%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContributionProjectGoal;

'use client';

import { useEffect, useState } from 'react';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { useTranslation } from '@/i18n/client';
import { totalMoneyGatheredQuery } from '@/lib/payload/queries/contribution';

export const PROJECT_GOAL = 900000;

const ContributionProjectGoal = () => {
  const [barSettings, setBarSettings] = useState<{ width: string; percent: string }>({
    width: '0px',
    percent: '0',
  });
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'transparency');
  const [totalContribution, setTotalContribution] = useState<number>(0);

  const getCurrentProjetContribution = async () => {
    try {
      const response = await totalMoneyGatheredQuery();
      setTotalContribution(response);
    } catch (e) {}
  };

  useEffect(() => {
    getCurrentProjetContribution();
  }, []);

  useEffect(() => {
    const normalizedGoal = (totalContribution || 0) / PROJECT_GOAL;
    const goalAsPercentage = (normalizedGoal * 100).toFixed(2);
    const loadingWidth = Math.round((window?.innerWidth || 0) * normalizedGoal) + 'px';
    setBarSettings({ width: loadingWidth, percent: goalAsPercentage });
  }, [totalContribution]);

  return (
    <div className='bg-bege-light flex flex-col gap-4 px-8 py-8 lg:px-40 lg:py-20'>
      <h2 className='lg:text-h1_semibold text-h2_bold text-green text-center'>
        {t('current_goal')}
      </h2>
      <h6 className='lg:text-h2_light mt-1 text-center'>{`${t('goal')}: ${PROJECT_GOAL}€`}</h6>
      <div className='border-green relative mt-5 h-6 w-full rounded-xs border'>
        <div
          className={`from-bege-dark to-bege-light h-full bg-linear-to-r from-10% to-95%`}
          style={{ width: barSettings.width }}
        >
          <p className='absolute my-auto flex w-full justify-center'>
            {totalContribution}€ ({barSettings.percent}%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContributionProjectGoal;

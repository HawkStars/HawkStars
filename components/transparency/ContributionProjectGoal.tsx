'use client';

import { useEffect, useState } from 'react';
import { getTotalMoneyGathered } from '@/server/contribution';

export const PROJECT_GOAL = 900000;

const ContributionProjectGoal = () => {
  const [totalContribution, setTotalContribution] = useState<number | undefined>();
  const normalizedGoal = (totalContribution || 0) / PROJECT_GOAL;
  const goalAsPercentage = (normalizedGoal * 100).toFixed(2);
  const loadingWidth = Math.round((window?.innerWidth || 0) * normalizedGoal) + 'px';

  const getCurrentProjetContribution = async () => {
    const moneyGathered = await getTotalMoneyGathered();

    setTotalContribution(moneyGathered);
  };

  useEffect(() => {
    getCurrentProjetContribution();
  }, []);

  return (
    <div className='flex flex-col gap-1'>
      <h3 className='text-green'>Current Project Contribution:</h3>
      <div className='relative mt-2 h-6 w-full rounded-md border border-bege-dark'>
        <div
          className={`h-full bg-gradient-to-r from-bege-dark from-10% to-bege-light to-95%`}
          style={{ width: loadingWidth }}
        ></div>
        <p className='mt-1 flex justify-end'>{`Goal: ${PROJECT_GOAL}€`}</p>
        <p className='absolute bottom-0 left-[50%] text-sm'>
          {totalContribution}€ ({goalAsPercentage}%)
        </p>
      </div>
    </div>
  );
};

export default ContributionProjectGoal;

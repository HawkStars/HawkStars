'use client';

import { useEffect, useState } from 'react';
import { getTotalMoneyGathered } from '@/services/contribution';

const PROJECT_GOAL = 1200000;

const ContributionProjectGoal = () => {
  const [totalContribution, setTotalContribution] = useState<
    number | undefined
  >();
  const percentGoal = (totalContribution || 0) / PROJECT_GOAL;
  const loadingWidth =
    Math.round((window?.innerWidth || 0) * percentGoal) + 'px';

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
        <p className='mt-1 flex justify-end'>Goal: 1.200.000,00€</p>
        <p className='absolute bottom-0 left-[50%] text-sm'>
          {totalContribution}€ ({percentGoal}%)
        </p>
      </div>
    </div>
  );
};

export default ContributionProjectGoal;

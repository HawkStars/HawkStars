'use client';
import { getTotalMoneyGathered } from '@/server/contribution';
import { useEffect, useState } from 'react';
import DashboardFormList from './FormListSection/FormListSection';
import { HawkStarsSection } from '@/components/layout';

const Dashboard = () => {
  const [moneyGathered, setMoneyGathered] = useState<number>(0);

  const getCurrentProjetContribution = async () => {
    const moneyGathered = await getTotalMoneyGathered();
    setMoneyGathered(moneyGathered);
  };

  useEffect(() => {
    getCurrentProjetContribution();
  }, []);

  return (
    <HawkStarsSection>
      <div className='flex flex-col gap-4'>
        <h6>Money Gathered</h6>
        <p>{moneyGathered || '-'}€</p>
      </div>
      <DashboardFormList />
    </HawkStarsSection>
  );
};

export default Dashboard;

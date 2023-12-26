'use client';
import { getTotalMoneyGathered } from '@/services/contribution';
import { useEffect, useState } from 'react';

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
    <section className='layout-section w-full'>
      <div className='flex flex-col gap-4'>
        <h6>Money Gathered</h6>
        <p>{moneyGathered}€</p>
      </div>
    </section>
  );
};

export default Dashboard;

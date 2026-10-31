'use client';

import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { useTranslation } from '@/i18n/client';
import { formatCurrency } from '@/lib/utils/currency';
import { PageHero, PageLoading } from '@/components/layout';
import dynamic from 'next/dynamic';

export const PROJECT_GOAL = 900000;

const ContributionProgressBar = dynamic(
  () => import('@/components/transparency/ContributionProgressBar'),
  { loading: () => <PageLoading />, ssr: false }
);

const ContributionProjectGoal = ({ sumContributions }: { sumContributions: number }) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'transparency');

  return (
    <PageHero
      align='center'
      title={t('current_goal')}
      description={`${t('goal')}: ${formatCurrency(PROJECT_GOAL, lng)}`}
    >
      {/* Was `${PROJECT_GOAL}€` — no grouping separators and the symbol on the
          wrong side for pt-PT, next to a ledger that formats amounts properly. */}
      <div className='mt-10'>
        <ContributionProgressBar sumContributions={sumContributions} projectGoal={PROJECT_GOAL} />
      </div>
    </PageHero>
  );
};

export default ContributionProjectGoal;

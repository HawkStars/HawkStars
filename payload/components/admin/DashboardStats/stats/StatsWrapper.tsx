import ContentStatusWidget from '../ContentStatusWidget';
import StatisticsWidget from '../StatisticsWidget';
import { fetchDashboardStats } from '../queries';

const StatsWrapper = async () => {
  const { data, errors } = await fetchDashboardStats();
  return (
    <>
      <StatisticsWidget stats={data} loading={false} error={errors} />
      <ContentStatusWidget stats={data} loading={false} error={errors} />
    </>
  );
};

export default StatsWrapper;

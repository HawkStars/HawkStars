import { PageHero } from '@/components/layout';

type NewsListHeaderProps = {
  title: string;
  subtitle?: string | null;
};

const NewsListHeader = ({ title, subtitle }: NewsListHeaderProps) => {
  return <PageHero title={title} description={subtitle ?? undefined} />;
};

export default NewsListHeader;

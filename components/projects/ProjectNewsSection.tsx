import { News } from '@/payload-types';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { getImagePayloadUrl } from '@/lib/image';
import { Badge } from '@/components/ui/badge';
import { transformUrl, urls } from '@/utils/paths';

type ProjectNewsSectionProps = {
  news: News[];
  lng: string;
  title?: string;
};

const NewsTypeLabels: Record<News['type'], string> = {
  blog: 'Blog',
  news: 'News',
  press_release: 'Press Release',
  announcement: 'Announcement',
  other: 'Other',
};

const ProjectNewsSection = ({ news, lng, title = 'Related News' }: ProjectNewsSectionProps) => {
  if (!news || news.length === 0) return null;

  return (
    <section className='bg-white py-16'>
      <div className='container mx-auto max-w-6xl px-4'>
        <h2 className='mb-8 text-4xl font-bold'>{title}</h2>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {news.map((article) => {
            const image = getImagePayloadUrl(article.mainImage);
            const articleUrl = transformUrl(lng, `${urls.news}/${article.slug}`);

            return (
              <Link
                key={article.id}
                href={articleUrl}
                className='group flex flex-col overflow-hidden rounded-lg border transition-shadow hover:shadow-md'
              >
                {image?.url && (
                  <div className='relative aspect-video w-full'>
                    <Image
                      src={image.url}
                      alt={image.alt || article.title}
                      fill
                      className='object-cover transition-transform group-hover:scale-105'
                    />
                  </div>
                )}
                <div className='flex flex-1 flex-col gap-2 p-4'>
                  <div className='flex items-center gap-2'>
                    <Badge variant='secondary'>{NewsTypeLabels[article.type]}</Badge>
                    {article.publishedAt && (
                      <span className='text-muted-foreground text-xs'>
                        {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  <h3 className='line-clamp-2 text-base font-semibold group-hover:underline'>
                    {article.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectNewsSection;

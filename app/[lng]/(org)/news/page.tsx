import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return { robots: 'noindex, nofollow' };
}

const NewsIndexPage = () => {
  return (
    <section className='py-32'>
      <div className='container mx-auto'>
        <div className='mb-8 md:mb-14 lg:mb-16'>
          <div className='flex items-start justify-between gap-8'>
            <div>
              <h1 className='mb-4 w-full text-4xl font-medium md:mb-5 md:text-5xl lg:mb-6 lg:text-6xl'>
                Blog
              </h1>
            </div>
          </div>
          <p>Insights, tutorials, and thoughts on modern software development</p>
        </div>
        <div className='grid gap-x-4 gap-y-8 md:grid-cols-2 lg:gap-x-6 lg:gap-y-12 2xl:grid-cols-3'></div>
        <div className='mt-8 flex flex-col items-center py-2 md:hidden'>
          <Button className='w-full sm:w-fit'>View all posts</Button>
        </div>
      </div>
    </section>
  );
};

export default NewsIndexPage;

import { ImageMedia } from '@/payload/components/Media';
import { hawkLogo } from '@/utils/models/images/logos';

/** Shared loading state for org routes — `loading.tsx` and page-level `<Suspense>` fallbacks. */
export const PageLoading = () => (
  <div
    role='status'
    aria-busy='true'
    className='mx-auto mt-10 flex min-h-[50vh] w-1/2 justify-center lg:mt-20'
  >
    <div className='bg-bege-dark h-fit animate-pulse rounded-3xl p-4'>
      <ImageMedia src={hawkLogo} alt='' width={200} />
    </div>
  </div>
);

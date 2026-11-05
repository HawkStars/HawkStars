import { ImageMedia } from '@/payload/components/Media';
import { hawkLogo } from '@/utils/models/images/logos';

const LOGO_WIDTH = 240;

// The shine is masked to the logo's own silhouette, so the light only moves across
// the mark and lettering — never across the empty background around it.
const logoMask = {
  maskImage: `url(${hawkLogo.src})`,
  WebkitMaskImage: `url(${hawkLogo.src})`,
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
} as const;

/**
 * Shared loading state for org routes — `loading.tsx` and page-level `<Suspense>` fallbacks.
 * Uses the full lockup (mark + wordmark); all motion is `motion-safe` so users who prefer
 * reduced motion get a still logo and a static bar.
 */
export const PageLoading = () => (
  <div
    role='status'
    aria-busy='true'
    className='flex min-h-[50vh] w-full flex-col items-center justify-center gap-8 px-4 py-16'
  >
    <div className='motion-safe:animate-logo-enter relative' style={{ width: LOGO_WIDTH }}>
      <ImageMedia src={hawkLogo} alt='' width={LOGO_WIDTH} preload />
      <span aria-hidden='true' className='absolute inset-0 overflow-hidden' style={logoMask}>
        <span className='motion-safe:animate-logo-shine absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-linear-to-r from-transparent via-white/80 to-transparent' />
      </span>
    </div>

    <div aria-hidden='true' className='bg-bege-dark h-1 w-40 overflow-hidden rounded-full'>
      <span className='bg-green motion-safe:animate-loading-bar block h-full w-1/3 rounded-full' />
    </div>
  </div>
);

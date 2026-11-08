import { ImageMedia } from '@/payload/components/Media';
import { hawkLogoMark } from '@/utils/models/images/logos';

const STAR_COUNT = 12;
const RADIUS = 42;
const STAR_PATH =
  'M0,-1 L0.2245,-0.309 L0.951,-0.309 L0.3633,0.118 L0.5878,0.809 L0,0.382 L-0.5878,0.809 L-0.3633,0.118 L-0.951,-0.309 L-0.2245,-0.309 Z';

const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
  const angle = (i / STAR_COUNT) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + RADIUS * Math.cos(angle), y: 50 + RADIUS * Math.sin(angle), delay: i * 260 };
});

/**
 * Twelve stars — the European flag's ring — slowly orbiting the Hawk Stars mark.
 * Purely decorative: the label is on the wrapper for screen readers.
 */
export const StarRing = ({ label }: { label: string }) => (
  <div role='img' aria-label={label} className='relative aspect-square w-full max-w-md'>
    <div className='bg-gold/15 absolute inset-[18%] rounded-full blur-3xl' />
    <svg viewBox='0 0 100 100' className='animate-spin-slow absolute inset-0 size-full'>
      <circle
        cx='50'
        cy='50'
        r={RADIUS}
        fill='none'
        className='stroke-white/15'
        strokeWidth='0.3'
        strokeDasharray='0.8 2'
      />
      {stars.map((star) => (
        <g key={star.delay} transform={`translate(${star.x} ${star.y}) scale(3.4)`}>
          <path
            d={STAR_PATH}
            className='fill-gold animate-twinkle origin-center transform-fill'
            style={{ animationDelay: `${star.delay}ms` }}
          />
        </g>
      ))}
    </svg>
    <div className='animate-float absolute inset-[24%] flex items-center justify-center rounded-full bg-white shadow-2xl ring-8 ring-white/10'>
      <ImageMedia src={hawkLogoMark} alt='' className='size-3/4' priority />
    </div>
  </div>
);

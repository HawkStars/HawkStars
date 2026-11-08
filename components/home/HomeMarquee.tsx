import { LuSparkle } from 'react-icons/lu';
import { marqueeKeys } from './config';
import type { HomeT } from './types';

/** An endless ribbon of what we do. The list is rendered twice so the loop has no seam. */
export const HomeMarquee = ({ t }: { t: HomeT }) => {
  const words = marqueeKeys.map((key) => t(`marquee.${key}`));

  return (
    <div className='bg-bege-dark border-green/10 overflow-hidden border-y py-5'>
      <div className='animate-marquee flex w-max hover:[animation-play-state:paused]'>
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className='flex shrink-0 items-center'>
            {words.map((word) => (
              <li
                key={word}
                className='text-h2_bold text-green flex items-center gap-8 pr-8 whitespace-nowrap uppercase'
              >
                {word}
                <LuSparkle aria-hidden='true' className='text-terracotta size-5' />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

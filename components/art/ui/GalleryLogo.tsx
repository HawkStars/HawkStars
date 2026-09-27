import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import headerLogo from '@/public/images/art-gallery/logo-cabecalho.svg';
import footerLogo from '@/public/images/art-gallery/logo-rodape.svg';

type GalleryLogoProps = {
  by: string;
  name: string;
  tagline: string;
  /** `header`: horizontal logo (navbar). `footer`: vertical logo. */
  variant?: 'header' | 'footer';
  className?: string;
};

/**
 * The gallery's logo (emblem + "Galeria de Arte · Impacto Social" wordmark):
 * horizontal in the navbar, vertical in the footer. The texts are its
 * accessible name.
 */
export function GalleryLogo({
  by,
  name,
  tagline,
  variant = 'header',
  className,
}: GalleryLogoProps) {
  const isFooter = variant === 'footer';
  return (
    <ImageMedia
      src={isFooter ? footerLogo : headerLogo}
      alt={`${name} ${tagline} — ${by}`}
      preload={!isFooter}
      unoptimized
      className={cn(isFooter ? 'h-32 w-auto md:h-36' : 'h-12 w-auto md:h-14', className)}
    />
  );
}

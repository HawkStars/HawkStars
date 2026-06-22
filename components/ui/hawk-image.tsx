import Image, { ImageProps } from 'next/image';

/* Placeholder the SVG blur technique for images */

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#e2e8f0"/>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export const svgBlur = (w: number, h: number) =>
  `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;

/* End of SVG blur technique */

type HawkImageProps = Pick<
  ImageProps,
  'alt' | 'width' | 'height' | 'src' | 'sizes' | 'className' | 'fill' | 'quality'
>;

const HawkImage: React.FC<HawkImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  fill,
}) => {
  return (
    <Image
      src={src}
      alt={alt || ''}
      width={width || 600}
      height={height || 400}
      className={className}
      sizes={sizes || '(max-width: 768px) 100vw, 33vw'}
      placeholder='blur'
      blurDataURL={svgBlur(600, 400)}
      fill={fill}
      quality={fill ? 80 : undefined}
    />
  );
};

export default HawkImage;

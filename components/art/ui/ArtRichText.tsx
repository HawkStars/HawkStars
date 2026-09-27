import RichText from '@/payload/components/RichText';
import { cn } from '@/lib/utils';

type ArtRichTextProps = { data: Parameters<typeof RichText>[0]['data']; className?: string };

/** Payload rich text in the gallery's dark theme (see `.art-richtext` in globals.css). */
export function ArtRichText({ data, className }: ArtRichTextProps) {
  return (
    <div className={cn('art-richtext text-art-text-2 font-art-sans', className)}>
      <RichText data={data} />
    </div>
  );
}

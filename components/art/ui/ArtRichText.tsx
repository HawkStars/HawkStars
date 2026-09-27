import RichText from '@/payload/components/RichText';
import { cn } from '@/lib/utils';
import { Language } from '@/i18n/settings';

type ArtRichTextProps = {
  data: Parameters<typeof RichText>[0]['data'];
  className?: string;
  lng: Language;
};

/** Payload rich text in the gallery's dark theme (see `.art-richtext` in globals.css). */
export function ArtRichText({ data, className, lng }: ArtRichTextProps) {
  return (
    <div className={cn('art-richtext text-art-text-2 font-art-sans', className)}>
      <RichText data={data} lng={lng} />
    </div>
  );
}

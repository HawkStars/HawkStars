import React from 'react';
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import type { LongDocumentBlock as LongDocumentBlockProps } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { getNodeText, slugifyHeading } from '@/payload/components/utils/nodeText';
import { cn } from '@/lib/utils';
import { Language } from '@/i18n/settings';

const CONTENTS_LABEL: Record<Language, string> = { pt: 'Índice', en: 'Contents' };

type HeadingNode = { type: string; tag?: string; text?: string; children?: HeadingNode[] };

/** H2 headings of the text, with the same anchor ids the heading converter gives them. */
const getContents = (content: LongDocumentBlockProps['content']) =>
  ((content?.root?.children ?? []) as HeadingNode[])
    .filter((node) => node.type === 'heading' && node.tag === 'h2')
    .map((node) => {
      const label = getNodeText(node);
      return { id: slugifyHeading(label), label };
    })
    .filter((item) => item.id);

type Props = LongDocumentBlockProps & {
  lng: Language;
  /** Renders the rich-text content; supplied by RichText, which owns the converters. */
  renderContent?: (content: DefaultTypedEditorState) => React.ReactNode;
};

export const LongDocumentBlock: React.FC<Props> = ({
  eyebrow,
  title,
  note,
  content,
  footnote,
  showContents,
  background,
  sectionId,
  lng,
  renderContent,
}) => {
  if (!content) return null;
  const contents = showContents === false ? [] : getContents(content);
  const hasContents = contents.length > 1;

  return (
    <HawkStarsSection
      spacing='default'
      className={background === 'white' ? 'bg-white' : 'bg-bege-light'}
      id={sectionId || undefined}
      data-blockid='longDocument'
    >
      {(eyebrow || title) && <SectionHeader reveal eyebrow={eyebrow} title={title} />}
      {note && (
        <p className='border-green mt-6 max-w-3xl border-l-4 bg-white p-4 text-black/80'>{note}</p>
      )}

      <div
        className={cn(
          'mt-10 grid grid-cols-1 gap-10',
          hasContents && 'lg:grid-cols-[16rem_1fr] lg:gap-14'
        )}
      >
        {hasContents && (
          <nav aria-label={CONTENTS_LABEL[lng]} className='lg:sticky lg:top-28 lg:self-start'>
            <p className='text-eyebrow text-green mb-3'>{CONTENTS_LABEL[lng]}</p>
            <ol className='flex flex-col gap-1 text-sm lg:max-h-[70vh] lg:overflow-y-auto lg:pr-2'>
              {contents.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className='hover:text-green block rounded-md px-2 py-1.5 text-black/70 transition-colors hover:bg-white'
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <article className='card max-w-3xl bg-white p-6 lg:p-10 [&_h2]:scroll-mt-28'>
          {renderContent?.(content as DefaultTypedEditorState)}
          {footnote && (
            <p className='border-bege-dark mt-10 border-t pt-6 text-sm text-black/60'>{footnote}</p>
          )}
        </article>
      </div>
    </HawkStarsSection>
  );
};

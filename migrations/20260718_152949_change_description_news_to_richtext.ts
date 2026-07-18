import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb';
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

/**
 * Wrap a plain string into a minimal Lexical rich-text document.
 */
const buildRichText = (text: string): DefaultTypedEditorState =>
  ({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              text: text || '',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr',
        },
      ],
      direction: 'ltr',
    },
  }) as unknown as DefaultTypedEditorState;

/**
 * The `references[].title` field is NOT localized (schema type = string), but
 * legacy data can hold a localized object shape like `{ pt: '...' }`. Coerce any
 * such value back down to a plain string so Mongoose does not throw a CastError.
 */
const normalizeTitle = (value: unknown): string | undefined => {
  if (value == null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const map = value as Record<string, unknown>;
    const picked = map.pt ?? map.en ?? Object.values(map)[0];
    return typeof picked === 'string' ? picked : undefined;
  }
  return String(value);
};

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const news = await payload.find({
    collection: 'news',
    depth: 0,
    draft: false,
    locale: 'pt',
    limit: 0, // no pagination cap — migrate every document
  });

  for (const doc of news.docs) {
    const rawText = doc.details?.text as unknown;

    // Idempotency guard: if `details.text` is already a rich-text object (i.e.
    // this doc was migrated in a previous / partially-completed run), reuse it
    // as-is instead of re-wrapping it into a text node.
    const alreadyRichText =
      !!rawText && typeof rawText === 'object' && 'root' in (rawText as Record<string, unknown>);

    const newRichTextFormat = alreadyRichText
      ? (rawText as DefaultTypedEditorState)
      : buildRichText(typeof rawText === 'string' ? rawText : '');

    const references = doc.references?.map((ref) => ({
      ...ref,
      title: normalizeTitle((ref as { title?: unknown }).title),
      platform: 'website' as const,
    }));

    // Scope the write to the `pt` locale (matching the locale we read) and only
    // touch the fields this migration owns — do NOT spread `...doc`, which would
    // re-write other localized fields under a no-locale update and can corrupt
    // them.
    await payload.update({
      collection: 'news',
      id: doc.id,
      locale: 'pt',
      data: {
        details: { text: newRichTextFormat },
        ...(references ? { references } : {}),
      },
    });
  }
}

export async function down({}: MigrateDownArgs): Promise<void> {
  throw new Error(
    'Do not want to revert this migration. The original text data is lost after the migration.'
  );
}

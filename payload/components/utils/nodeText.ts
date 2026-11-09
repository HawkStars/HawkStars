import type { CSSProperties } from 'react';

// Just the shape we read — any serialized Lexical node satisfies it.
type TextBearingNode = { type: string; text?: string; children?: TextBearingNode[] };

/**
 * Payload turns an element's alignment and indent into inline styles on whatever the
 * converter returns, and lets the converter's own `style` win. We override both:
 * - justified text opens rivers of space between words (worst on mobile), so it falls
 *   back to start; other alignments pass through;
 * - indent arrives as `padding-inline-start: 40px` per level, which would replace the
 *   column's start (`--rt-start`), so it is added to it instead.
 * List items are skipped for indent, as Payload does: their nesting is the indent.
 */
export const proseStyle = (node: {
  type?: string;
  format?: unknown;
  indent?: unknown;
}): CSSProperties | undefined => {
  const style: CSSProperties = {};
  if (node.format === 'justify') style.textAlign = 'start';
  const indent = Number(node.indent) || 0;
  if (indent > 0 && node.type !== 'listitem') {
    style.paddingInlineStart = `calc(var(--rt-start, 0px) + ${indent * 2.5}rem)`;
  }
  return Object.keys(style).length ? style : undefined;
};

/** Plain text of a Lexical node and everything under it. */
export const getNodeText = (node: TextBearingNode): string => {
  if (node.type === 'text') return node.text ?? '';
  return (node.children ?? []).map(getNodeText).join('');
};

/** URL-safe anchor id from heading text: "Formas de Doação" → "formas-de-doacao". */
export const slugifyHeading = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

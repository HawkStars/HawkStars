import type { CSSProperties } from 'react';

// Just the shape we read — any serialized Lexical node satisfies it.
type TextBearingNode = { type: string; text?: string; children?: TextBearingNode[] };

/**
 * Payload turns an element's alignment into an inline `text-align`, and lets a
 * converter's own `style` win. Justified text opens rivers of space between words
 * (worst on mobile), so justify falls back to start; other alignments pass through.
 */
export const noJustify = (node: { format?: unknown }): CSSProperties | undefined =>
  node.format === 'justify' ? { textAlign: 'start' } : undefined;

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

import type {
  ContentWithImageBlock,
  DataGridBlock,
  GlobalVillageBannerBlock,
  GrowthVisionBlock,
  HeroWithBackgroundImageBlock,
  ImageComparisonSliderBlock,
  ImageShowcaseBlock,
  Page,
  QuoteHighlightBlock,
  SectionTitleBlock,
  WhyHereWhyNowBlock,
} from '@/payload-types';

type VillageBlock =
  | HeroWithBackgroundImageBlock
  | GlobalVillageBannerBlock
  | ImageComparisonSliderBlock
  | WhyHereWhyNowBlock
  | ContentWithImageBlock
  | GrowthVisionBlock
  | ImageShowcaseBlock
  | DataGridBlock
  | SectionTitleBlock
  | QuoteHighlightBlock;

type LexicalNode = { type?: string; text?: string; children?: LexicalNode[]; fields?: unknown };

/** Blocks of the /village page, wherever the editor put them (rich-text layout or blocks list). */
const collectBlocks = (page: Page): VillageBlock[] => {
  const fromLayout = (page.layout?.root.children ?? [])
    .filter((node) => node.type === 'block')
    .map((node) => (node as LexicalNode).fields as VillageBlock);
  return [...fromLayout, ...((page.blocks ?? []) as VillageBlock[])];
};

const first = <T extends VillageBlock['blockType']>(blocks: VillageBlock[], type: T) =>
  blocks.find((b) => b.blockType === type) as Extract<VillageBlock, { blockType: T }> | undefined;

/**
 * Pulls the Village content out of the CMS page so this test page can restyle it in the
 * crowdfunding palette while the copy keeps living in Payload.
 */
export const getVillageSections = (page: Page) => {
  const blocks = collectBlocks(page);
  const whyBlocks = blocks.filter(
    (b): b is WhyHereWhyNowBlock => b.blockType === 'whyHereWhyNowBlock'
  );

  return {
    manifesto: first(blocks, 'globalVillageBanner'),
    comparison: first(blocks, 'imageComparisonSlider'),
    challenges: whyBlocks[0],
    opportunities: whyBlocks[1],
    proposal: first(blocks, 'contentWithImage'),
    vision: first(blocks, 'growthVisionBlock'),
    gallery: first(blocks, 'imageShowcase'),
    impact: first(blocks, 'dataGridBlock'),
    join: first(blocks, 'sectionTitleBlock'),
    quote: first(blocks, 'quoteHighlight'),
  };
};

export type VillageSections = ReturnType<typeof getVillageSections>;

/**
 * Splits a Lexical description into prose and bullet points. Editors write the intro both
 * as list items and as line-broken paragraphs, so a line ending in "." or ":" counts as
 * prose and anything shorter is a bullet.
 */
export const splitProse = (root?: { children?: unknown[] } | null) => {
  const textOf = (node: LexicalNode): string =>
    node.type === 'linebreak' ? '\n' : (node.text ?? (node.children ?? []).map(textOf).join(''));
  const lines = ((root?.children ?? []) as LexicalNode[])
    .flatMap((node) => (node.type === 'list' ? (node.children ?? []) : [node]))
    .flatMap((node) => textOf(node).split('\n'))
    .map((line) => line.trim())
    .filter(Boolean);
  const isProse = (line: string) => /[.:]$/.test(line);
  return { paragraphs: lines.filter(isProse), items: lines.filter((line) => !isProse(line)) };
};

/** Splits "🚀 Start-ups" into its leading emoji and the label. */
export const splitEmoji = (value: string) => {
  const match = value.match(/^(\p{Extended_Pictographic}\uFE0F?)\s*(.*)$/u);
  return match ? { emoji: match[1], label: match[2] } : { emoji: undefined, label: value };
};

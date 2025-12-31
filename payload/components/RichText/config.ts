import type {
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
  HeroBlock as HeroProps,
  HeroWithBackgroundImageBlock as HeroWithBackgroundImageProps,
  HeroImpactStatsBlock as HeroImpactStatsProps,
  ContentWithImageBlock as ContentWithImageProps,
  VideoBlock as VideoBlockProps,
  StatsBlock as StatsBlockProps,
  TestimonialBlock as TestimonialBlockProps,
  Projects18Block as Projects18BlockProps,
  ProcessOneBlock as ProcessOneBlockProps,
  ImpactBlock as ImpactBlockProps,
  CardGridBlock as CardGridBlockProps,
  ColumnBasedBlock as ColumnBasedBlockProps,
  SimpleCTABlock as SimpleCTABlockProps,
  ImageComparison as ImageComparisonProps,
  AboutBlock as AboutBlockProps,
  GlobalVillageAboutSectionBlock as GlobalVillageAboutSectionBlockProps,
  HeroSlideshowBlock as HeroSlideshowBlockProps,
  MultiRowImageBlock as MultiRowImageProps,
  TitleDescriptionBlock as TitleDescriptionBlockProps,
  BentoGridBlock as BentoGridBlockProps,
} from '@/payload-types';
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical';

export type NodeTypes = DefaultNodeTypes | BlockNodeTypes;

export type BlockNodeTypes = SerializedBlockNode<
  | CTABlockProps
  | MediaBlockProps
  | HeroProps
  | HeroWithBackgroundImageProps
  | HeroImpactStatsProps
  | ContentWithImageProps
  | VideoBlockProps
  | TestimonialBlockProps
  | StatsBlockProps
  | Projects18BlockProps
  | ProcessOneBlockProps
  | ImpactBlockProps
  | CardGridBlockProps
  | ColumnBasedBlockProps
  | SimpleCTABlockProps
  | ImageComparisonProps
  | AboutBlockProps
  | GlobalVillageAboutSectionBlockProps
  | HeroSlideshowBlockProps
  | MultiRowImageProps
  | TitleDescriptionBlockProps
  | BentoGridBlockProps
>;

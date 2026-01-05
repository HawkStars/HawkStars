import type {
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
  HeroBlock as HeroProps,
  HeroWithBackgroundImageBlock as HeroWithBackgroundImageProps,
  HeroImpactStatsBlock as HeroImpactStatsProps,
  ContentWithImageBlock as ContentWithImageProps,
  VideoBlock as VideoBlockProps,
  TestimonialBlock as TestimonialBlockProps,
  Projects18Block as Projects18BlockProps,
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
  | Projects18BlockProps
  | AboutBlockProps
  | GlobalVillageAboutSectionBlockProps
  | HeroSlideshowBlockProps
  | MultiRowImageProps
  | TitleDescriptionBlockProps
  | BentoGridBlockProps
>;

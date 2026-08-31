'use client';

import * as Sentry from '@sentry/nextjs';
import './richtext.scss';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

import { MediaBlock } from '@/payload/blocks/MediaBlock/Component';
import { HeroBlock } from '@/payload/blocks/Hero/Component';
import { HeroWithBackgroundImageBlock } from '@/payload/blocks/HeroWithBackgroundImage/Component';
import { ContentWithImageBlock } from '@/payload/blocks/ContentWithImage/Component';
import { VideoBlock } from '@/payload/blocks/VideoBlock/Component';
import { GlobalVillageAboutSectionBlockComponent } from '@/payload/blocks/GlobalVillageAboutSection/Component';
import { TestimonialBlock } from '@/payload/blocks/TestimonialBlock/Component';
import {
  SerializedLinkNode,
  type DefaultTypedEditorState,
  type SerializedBlockNode,
} from '@payloadcms/richtext-lexical';
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react';
import type { ComponentType } from 'react';

import { CallToActionBlock } from '@/payload/blocks/CallToAction/Component';

import List from '../utils/list';
import ListItem from '../utils/listItem';
import Paragraph from '../utils/paragraph';
import { HeroSlideshowBlock } from '@/payload/blocks/HeroSlideshowBlock/Component';
import MultiRowImage from '@/payload/blocks/MultiRowImage/Component';
import { TitleDescriptionBlock } from '@/payload/blocks/TitleDescriptionBlock/Component';
import { NodeTypes } from './config';
import BentoGridBlock from '@/payload/blocks/BentoGridBlock/Component';
import Heading from '../utils/heading';
import { StatsBlock } from '@/payload/blocks/StatsBlock/Component';
import { AccordionBlock } from '@/payload/blocks/AccordionBlock/Component';

const SimpleGallery = dynamic(() => import('@/payload/blocks/SimpleGallery/Component'), {
  ssr: false,
});
import { ProjectTestimonialBlock } from '@/payload/blocks/ProjectTestimonialBlock/Component';
import { LogosBlock } from '@/payload/blocks/LogosBlock/Component';
import { GlobalVillageBannerBlockComponent } from '@/payload/blocks/GlobalVillageBanner/Component';
import { CampaignCountdownBlock } from '@/payload/blocks/CampaignCountdownBlock/Component';
import { CTABannerBlock } from '@/payload/blocks/CTABannerBlock/Component';
import { DonationProgressBlock } from '@/payload/blocks/DonationProgressBlock/Component';
import { FAQBlock } from '@/payload/blocks/FAQBlock/Component';
import { ImageComparisonSliderBlock } from '@/payload/blocks/ImageComparisonSliderBlock/Component';
import { MapLocationBlock } from '@/payload/blocks/MapLocationBlock/Component';
import { NewsletterSignupBlock } from '@/payload/blocks/NewsletterSignupBlock/Component';
import { OfferCatalogBlock } from '@/payload/blocks/OfferCatalogBlock/Component';
import { PricingTableBlock } from '@/payload/blocks/PricingTableBlock/Component';
import { QuoteHighlightBlock } from '@/payload/blocks/QuoteHighlightBlock/Component';
import { ResourceDownloadBlock } from '@/payload/blocks/ResourceDownloadBlock/Component';
import { SocialProofBlock } from '@/payload/blocks/SocialProofBlock/Component';
import { TimelineBlock } from '@/payload/blocks/TimelineBlock/Component';
import { ImageShowcaseBlock } from '@/payload/blocks/ImageShowcaseBlock/Component';
import { DonationWidgetBlock } from '@/payload/blocks/DonationWidgetBlock/Component';
import { DataGridBlock } from '@/payload/blocks/DataGridBlock/Component';
import { SponsorsBlock } from '@/payload/blocks/SponsorsBlock/Component';
import { UpcomingHawkEventBlock } from '@/payload/blocks/UpcomingHawkEventBlock/Component';
import { LatestNewsBlock } from '@/payload/blocks/LatestNewsBlock/Component';
import { WhyHereWhyNowBlock } from '@/payload/blocks/WhyHereWhyNowBlock/Component';
import { GrowthVisionBlock } from '@/payload/blocks/GrowthVisionBlock/Component';
import { InstagramBlockComponent } from '@/payload/blocks/InstagramBlock/Component';
import { AgendaBlockComponent } from '@/payload/blocks/AgendaBlock/Component';
import { CrowdfundingImageBannerBlockComponent } from '@/payload/blocks/CrowdfundingImageBanner/Component';
import { SectionTitleBlockComponent } from '@/payload/blocks/SectionTitleBlock/Component';
import { SectionListBlockComponent } from '@/payload/blocks/SectionListBlock/Component';
import Upload from '../utils/upload';
import HorizontalLine from '@/components/ui/horizontal-line';
import StepsBlockComponent from '@/payload/blocks/StepsBlock/Component';

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!;
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object');
  }
  const slug = value.slug;
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`;
};

/**
 * Registry mapping each Lexical block slug to the React component that renders
 * it. Every block converter shares the exact same shape — spread `node.fields`
 * into the component — so the converters are generated from this map by
 * `blockConverter` below instead of being hand-written 40+ times.
 *
 * This is a function, not a top-level object, on purpose. Some blocks (e.g.
 * ContentWithImage, GlobalVillageAboutSection) render RichText themselves, so
 * this module and those modules form an import cycle. If the registry were
 * built during module evaluation it would read those bindings while they are
 * still in the temporal dead zone whenever the cycle is entered from the block
 * side — the "Cannot access 'X' before initialization" crash seen in
 * Storybook. Building it lazily defers every binding read to first render,
 * by which point all modules in the cycle are fully initialized.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBlockComponents = (): Record<string, ComponentType<any>> => ({
  mediaBlock: MediaBlock,
  cta: CallToActionBlock,
  hero: HeroBlock,
  heroWithBackgroundImage: HeroWithBackgroundImageBlock,
  heroSlideshowBlock: HeroSlideshowBlock,
  contentWithImage: ContentWithImageBlock,
  videoBlock: VideoBlock,
  testimonialBlock: TestimonialBlock,
  globalVillageAboutSection: GlobalVillageAboutSectionBlockComponent,
  multiRowImage: MultiRowImage,
  titleDescriptionBlock: TitleDescriptionBlock,
  bentoGrid: BentoGridBlock,
  statsBlock: StatsBlock,
  accordion: AccordionBlock,
  simpleGallery: SimpleGallery,
  projectTestimonialBlock: ProjectTestimonialBlock,
  logosBlock: LogosBlock,
  globalVillageBanner: GlobalVillageBannerBlockComponent,
  campaignCountdown: CampaignCountdownBlock,
  ctaBanner: CTABannerBlock,
  donationProgress: DonationProgressBlock,
  faq: FAQBlock,
  imageComparisonSlider: ImageComparisonSliderBlock,
  mapLocation: MapLocationBlock,
  newsletterSignup: NewsletterSignupBlock,
  offerCatalog: OfferCatalogBlock,
  pricingTable: PricingTableBlock,
  quoteHighlight: QuoteHighlightBlock,
  resourceDownload: ResourceDownloadBlock,
  socialProof: SocialProofBlock,
  timeline: TimelineBlock,
  imageShowcase: ImageShowcaseBlock,
  donationWidget: DonationWidgetBlock,
  dataGridBlock: DataGridBlock,
  sponsorsBlock: SponsorsBlock,
  upcomingHawkEvent: UpcomingHawkEventBlock,
  latestNews: LatestNewsBlock,
  growthVisionBlock: GrowthVisionBlock,
  whyHereWhyNowBlock: WhyHereWhyNowBlock,
  instagram: InstagramBlockComponent,
  agenda: AgendaBlockComponent,
  crowdfundingImageBanner: CrowdfundingImageBannerBlockComponent,
  sectionTitleBlock: SectionTitleBlockComponent,
  sectionListBlock: SectionListBlockComponent,
  stepsBlock: StepsBlockComponent,
});

// Turn one registry entry into a block converter: render the component with the
// block's fields as props. These are Lexical converter callbacks, not React
// components rendered directly, so a display name is unnecessary.
const blockConverter =
  (Component: ComponentType<Record<string, unknown>>) =>
  // eslint-disable-next-line react/display-name
  ({ node }: { node: SerializedBlockNode }) => <Component {...node.fields} />;

// Built once, on first render, then cached — converter identities must stay
// stable across renders or React would remount every block on each update.
let blockConvertersCache: Record<string, ReturnType<typeof blockConverter>> | null = null;

const getBlockConverters = () => {
  blockConvertersCache ??= Object.fromEntries(
    Object.entries(getBlockComponents()).map(([slug, Component]) => [
      slug,
      blockConverter(Component),
    ])
  );
  return blockConvertersCache;
};

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  inlineBlocks: {},
  blocks: getBlockConverters(),
  list: List,
  listitem: ListItem,
  paragraph: Paragraph,
  horizontalrule: <HorizontalLine />,
  heading: Heading,
  linebreak: () => <br />,
  unknown: ({ node }) => {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(`Unknown node type: ${node.type}`, {
        level: 'warning',
        extra: { node },
      });
    }
    return null;
  },
  upload: Upload,
});

export type RichTextProps = {
  data: DefaultTypedEditorState;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: RichTextProps) {
  const { className, ...rest } = props;
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn('payload-richtext', className)}
      {...rest}
    />
  );
}

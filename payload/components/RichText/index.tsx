import dynamic from 'next/dynamic';
import * as Sentry from '@sentry/nextjs';
import './richtext.scss';

import { cn } from '@/lib/utils';

import { MediaBlock } from '@/payload/blocks/MediaBlock/Component';
import { HeroBlock } from '@/payload/blocks/Hero/Component';
import { HeroWithBackgroundImageBlock } from '@/payload/blocks/HeroWithBackgroundImage/Component';
import { ContentWithImageBlock } from '@/payload/blocks/ContentWithImage/Component';
import { VideoBlock } from '@/payload/blocks/VideoBlock/Component';
import { GlobalVillageAboutSectionBlockComponent } from '@/payload/blocks/GlobalVillageAboutSection/Component';
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
import { useMemo, type ComponentType } from 'react';

import { CallToActionBlock } from '@/payload/blocks/CallToAction/Component';

import List from '../utils/list';
import ListItem from '../utils/listItem';
import Paragraph from '../utils/paragraph';
import MultiRowImage from '@/payload/blocks/MultiRowImage/Component';
import { TitleDescriptionBlock } from '@/payload/blocks/TitleDescriptionBlock/Component';
import { NodeTypes } from './config';
import BentoGridBlock from '@/payload/blocks/BentoGridBlock/Component';
import Heading from '../utils/heading';
import { StatsBlock } from '@/payload/blocks/StatsBlock/Component';
import { AccordionBlock } from '@/payload/blocks/AccordionBlock/Component';

import { LogosBlock } from '@/payload/blocks/LogosBlock/Component';
import { GlobalVillageBannerBlockComponent } from '@/payload/blocks/GlobalVillageBanner/Component';
import { CTABannerBlock } from '@/payload/blocks/CTABannerBlock/Component';
import { MapLocationBlock } from '@/payload/blocks/MapLocationBlock/Component';
import { OfferCatalogBlock } from '@/payload/blocks/OfferCatalogBlock/Component';
import { PricingTableBlock } from '@/payload/blocks/PricingTableBlock/Component';
import { QuoteHighlightBlock } from '@/payload/blocks/QuoteHighlightBlock/Component';
import { ResourceDownloadBlock } from '@/payload/blocks/ResourceDownloadBlock/Component';
import { SocialProofBlock } from '@/payload/blocks/SocialProofBlock/Component';
import { TimelineBlock } from '@/payload/blocks/TimelineBlock/Component';
import { DataGridBlock } from '@/payload/blocks/DataGridBlock/Component';
import { WhyHereWhyNowBlock } from '@/payload/blocks/WhyHereWhyNowBlock/Component';
import { GrowthVisionBlock } from '@/payload/blocks/GrowthVisionBlock/Component';
import { InstagramBlockComponent } from '@/payload/blocks/InstagramBlock/Component';
import { CrowdfundingImageBannerBlockComponent } from '@/payload/blocks/CrowdfundingImageBanner/Component';
import { SectionTitleBlockComponent } from '@/payload/blocks/SectionTitleBlock/Component';
import { SectionListBlockComponent } from '@/payload/blocks/SectionListBlock/Component';
import Upload from '../utils/upload';
import HorizontalLine from '@/components/ui/horizontal-line';
import StepsBlockComponent from '@/payload/blocks/StepsBlock/Component';
import { createUrlByCollection } from '@/utils/paths';
import assert from 'assert';
import { Language } from '@/i18n/settings';
import SimpleGallery from '@/payload/blocks/SimpleGallery/Component';

type ValidCategory = 'hawk_projects' | 'hawk_events' | 'news';

const VALID_CATEGORIES = ['hawk_projects', 'hawk_events', 'news'] as const;

function isValidCategory(value: string): value is ValidCategory {
  return (VALID_CATEGORIES as readonly string[]).includes(value);
}

const makeInternalDocToHref =
  (lng: Language) =>
  ({ linkNode }: { linkNode: SerializedLinkNode }) => {
    const { value, relationTo } = linkNode.fields.doc!;
    if (typeof value !== 'object') {
      throw new Error('Expected value to be an object');
    }
    const slug = value.slug;
    assert(isValidCategory(relationTo));
    assert(typeof slug === 'string');
    return createUrlByCollection(relationTo, lng, slug);
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
// Client blocks are code-split. RichText backs the homepage and every CMS page, and
// importing all 45 blocks statically meant a page containing only a Hero and a
// MediaBlock still shipped the JS for the donation widget, the agenda calendar, embla
// and every carousel block. `dynamic()` without `ssr: false` keeps them
// server-rendered — only the client chunk is deferred to when the block is used.
const AgendaBlockComponent = dynamic(() =>
  import('@/payload/blocks/AgendaBlock/Component').then((m) => m.AgendaBlockComponent)
);
const CampaignCountdownBlock = dynamic(() =>
  import('@/payload/blocks/CampaignCountdownBlock/Component').then((m) => m.CampaignCountdownBlock)
);
const DonationProgressBlock = dynamic(() =>
  import('@/payload/blocks/DonationProgressBlock/Component').then((m) => m.DonationProgressBlock)
);
const DonationWidgetBlock = dynamic(() =>
  import('@/payload/blocks/DonationWidgetBlock/Component').then((m) => m.DonationWidgetBlock)
);
const FAQBlock = dynamic(() =>
  import('@/payload/blocks/FAQBlock/Component').then((m) => m.FAQBlock)
);
const HeroSlideshowBlock = dynamic(() =>
  import('@/payload/blocks/HeroSlideshowBlock/Component').then((m) => m.HeroSlideshowBlock)
);
const ImageComparisonSliderBlock = dynamic(() =>
  import('@/payload/blocks/ImageComparisonSliderBlock/Component').then(
    (m) => m.ImageComparisonSliderBlock
  )
);
const ImageShowcaseBlock = dynamic(() =>
  import('@/payload/blocks/ImageShowcaseBlock/Component').then((m) => m.ImageShowcaseBlock)
);
const LatestNewsBlock = dynamic(() =>
  import('@/payload/blocks/LatestNewsBlock/Component').then((m) => m.LatestNewsBlock)
);
const NewsletterSignupBlock = dynamic(() =>
  import('@/payload/blocks/NewsletterSignupBlock/Component').then((m) => m.NewsletterSignupBlock)
);
const ProjectTestimonialBlock = dynamic(() =>
  import('@/payload/blocks/ProjectTestimonialBlock/Component').then(
    (m) => m.ProjectTestimonialBlock
  )
);
const SponsorsBlock = dynamic(() =>
  import('@/payload/blocks/SponsorsBlock/Component').then((m) => m.SponsorsBlock)
);
const TestimonialBlock = dynamic(() =>
  import('@/payload/blocks/TestimonialBlock/Component').then((m) => m.TestimonialBlock)
);
const UpcomingHawkEventBlock = dynamic(() =>
  import('@/payload/blocks/UpcomingHawkEventBlock/Component').then((m) => m.UpcomingHawkEventBlock)
);

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
  (Component: ComponentType<Record<string, unknown>>, lng: Language) =>
  // eslint-disable-next-line react/display-name
  ({ node }: { node: SerializedBlockNode }) => <Component {...node.fields} lng={lng} />;

// Built once per locale, then cached — converter identities must stay stable across
// renders or React would remount every block on each update.
//
// Keyed by locale, because `blockConverter` closes over `lng`: a single shared entry
// was filled by whichever locale rendered a rich-text block first in the process and
// then reused for the other one, so every block on an /en page received lng='pt' (and
// built its internal links accordingly) until the next restart.
const blockConvertersCache = new Map<Language, Record<string, ReturnType<typeof blockConverter>>>();

const getBlockConverters = (lng: Language) => {
  const cached = blockConvertersCache.get(lng);
  if (cached) return cached;

  const converters = Object.fromEntries(
    Object.entries(getBlockComponents()).map(([slug, Component]) => [
      slug,
      blockConverter(Component, lng),
    ])
  );
  blockConvertersCache.set(lng, converters);
  return converters;
};

const jsxConverters =
  (lng: Language): JSXConvertersFunction<NodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref: makeInternalDocToHref(lng) }),
    inlineBlocks: {},
    blocks: getBlockConverters(lng),
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
  lng: Language;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: RichTextProps) {
  const lng = props.lng;
  const converters = useMemo(() => jsxConverters(lng), [lng]);
  const { className, ...rest } = props;

  return (
    <ConvertRichText
      converters={converters}
      className={cn('payload-richtext', className)}
      {...rest}
    />
  );
}

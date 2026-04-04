import type {
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
  HeroBlock as HeroProps,
  HeroWithBackgroundImageBlock as HeroWithBackgroundImageProps,
  ContentWithImageBlock as ContentWithImageProps,
  VideoBlock as VideoBlockProps,
  TestimonialBlock as TestimonialBlockProps,
  AboutBlock as AboutBlockProps,
  GlobalVillageAboutSectionBlock as GlobalVillageAboutSectionBlockProps,
  HeroSlideshowBlock as HeroSlideshowBlockProps,
  MultiRowImageBlock as MultiRowImageProps,
  TitleDescriptionBlock as TitleDescriptionBlockProps,
  BentoGridBlock as BentoGridBlockProps,
  StatsBlock as StatsBlockProps,
  AccordionBlock as AccordionBlockProps,
  SimpleGallery as SimpleGalleryBlockProps,
  ProjectTestimonialBlock as ProjectTestimonialBlockProps,
  LogosBlock as LogosBlockProps,
  GlobalVillageBannerBlock as GlobalVillageBannerBlockProps,
  CampaignCountdownBlock as CampaignCountdownBlockProps,
  CTABannerBlock as CTABannerBlockProps,
  DonationProgressBlock as DonationProgressBlockProps,
  EventListBlock as EventListBlockProps,
  FAQBlock as FAQBlockProps,
  ImageComparisonSliderBlock as ImageComparisonSliderBlockProps,
  MapLocationBlock as MapLocationBlockProps,
  NewsletterSignupBlock as NewsletterSignupBlockProps,
  PricingTableBlock as PricingTableBlockProps,
  QuoteHighlightBlock as QuoteHighlightBlockProps,
  ResourceDownloadBlock as ResourceDownloadBlockProps,
  SocialProofBlock as SocialProofBlockProps,
  TeamGridBlock as TeamGridBlockProps,
  TimelineBlock as TimelineBlockProps,
  ImageShowcaseBlock as ImageShowcaseBlockProps,
  DonationWidgetBlock as DonationWidgetBlockProps,
  DataGridBlock as DataGridBlockProps,
  SponsorsBlock as SponsorsBlockProps,
  UpcomingHawkEventBlock as UpcomingHawkEventBlockProps,
  LatestNewsBlock as LatestNewsBlockProps,
  GrowthVisionBlock as GrowthVisionBlockProps,
  WhyHereWhyNowBlock as WhyHereWhyNowBlockProps,
  InstagramBlock as InstagramBlockProps,
  AgendaBlock as AgendaBlockProps,
} from '@/payload-types';
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical';

export type NodeTypes = DefaultNodeTypes | BlockNodeTypes;

export type BlockNodeTypes = SerializedBlockNode<
  | CTABlockProps
  | MediaBlockProps
  | HeroProps
  | HeroWithBackgroundImageProps
  | ContentWithImageProps
  | VideoBlockProps
  | TestimonialBlockProps
  | AboutBlockProps
  | GlobalVillageAboutSectionBlockProps
  | HeroSlideshowBlockProps
  | MultiRowImageProps
  | TitleDescriptionBlockProps
  | BentoGridBlockProps
  | StatsBlockProps
  | AccordionBlockProps
  | SimpleGalleryBlockProps
  | ProjectTestimonialBlockProps
  | LogosBlockProps
  | GlobalVillageBannerBlockProps
  | CampaignCountdownBlockProps
  | CTABannerBlockProps
  | DonationProgressBlockProps
  | EventListBlockProps
  | FAQBlockProps
  | ImageComparisonSliderBlockProps
  | MapLocationBlockProps
  | NewsletterSignupBlockProps
  | PricingTableBlockProps
  | QuoteHighlightBlockProps
  | ResourceDownloadBlockProps
  | SocialProofBlockProps
  | TeamGridBlockProps
  | TimelineBlockProps
  | ImageShowcaseBlockProps
  | DonationWidgetBlockProps
  | DataGridBlockProps
  | SponsorsBlockProps
  | UpcomingHawkEventBlockProps
  | LatestNewsBlockProps
  | GrowthVisionBlockProps
  | WhyHereWhyNowBlockProps
  | InstagramBlockProps
  | AgendaBlockProps
>;

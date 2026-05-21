// ── Hero & Layout ────────────────────────────────────────────
import { Hero } from './Hero/config';
import { HeroSlideshowBlock } from './HeroSlideshowBlock/config';
import { HeroWithBackgroundImage } from './HeroWithBackgroundImage/config';
import { CTABannerBlock } from './CTABannerBlock/config';
import { CrowdfundingImageBannerBlock } from './CrowdfundingImageBanner/config';
import { GlobalVillageBannerBlock } from './GlobalVillageBanner/config';
import { SectionTitleBlock } from './SectionTitleBlock/config';
import { SectionListBlock } from './SectionListBlock/config';

// ── Content ──────────────────────────────────────────────────
import { AccordionBlock } from './AccordionBlock/config';
import { ContentWithImage } from './ContentWithImage/config';
import { FAQBlock } from './FAQBlock/config';
import { QuoteHighlightBlock } from './QuoteHighlightBlock/config';
import { TimelineBlock } from './TimelineBlock/config';
import TitleDescriptionBlock from './TitleDescriptionBlock/config';
import { WhyHereWhyNowBlock } from './WhyHereWhyNowBlock/config';
import { GrowthVisionBlock } from './GrowthVisionBlock/config';
import { GlobalVillageAboutSectionBlock } from './GlobalVillageAboutSection/config';

// ── Media & Gallery ──────────────────────────────────────────
import { ImageComparisonSliderBlock } from './ImageComparisonSliderBlock/config';
import { ImageShowcaseBlock } from './ImageShowcaseBlock/config';
import { MediaBlock } from './MediaBlock/config';
import MultiRowImage from './MultiRowImage/config';
import SimpleGallery from './SimpleGallery/config';
import { VideoBlock } from './VideoBlock/config';

// ── Donations & Engagement ───────────────────────────────────
import { CallToAction } from './CallToAction/config';
import { CampaignCountdownBlock } from './CampaignCountdownBlock/config';
import { DonationProgressBlock } from './DonationProgressBlock/config';
import { DonationWidgetBlock } from './DonationWidgetBlock/config';
import { NewsletterSignupBlock } from './NewsletterSignupBlock/config';
import { PricingTableBlock } from './PricingTableBlock/config';
import { ResourceDownloadBlock } from './ResourceDownloadBlock/config';

// ── Social & Testimonials ────────────────────────────────────
import { LogosBlock } from './LogosBlock/config';
import { ProjectTestimonialBlock } from './ProjectTestimonialBlock/config';
import { SocialProofBlock } from './SocialProofBlock/config';
import { SponsorsBlock } from './SponsorsBlock/config';
import { TestimonialBlock } from './TestimonialBlock/config';

// ── Data & Events ────────────────────────────────────────────
import { AgendaBlock } from './AgendaBlock/config';
import { DataGridBlock } from './DataGridBlock/config';
import { LatestNewsBlock } from './LatestNewsBlock/config';
import { MapLocationBlock } from './MapLocationBlock/config';
import { StatsBlock } from './StatsBlock/config';
import { UpcomingHawkEventBlock } from './UpcomingHawkEventBlock/config';

const DefaultBlocks = [
  // Hero & Layout
  Hero,
  HeroWithBackgroundImage,
  CTABannerBlock,
  CrowdfundingImageBannerBlock,
  GlobalVillageBannerBlock,
  SectionTitleBlock,
  SectionListBlock,

  // Content
  AccordionBlock,
  ContentWithImage,
  FAQBlock,
  QuoteHighlightBlock,
  TimelineBlock,
  TitleDescriptionBlock,
  WhyHereWhyNowBlock,
  GrowthVisionBlock,
  GlobalVillageAboutSectionBlock,
  StepsConfigBlock,

  // Media & Gallery
  ImageComparisonSliderBlock,
  ImageShowcaseBlock,
  MediaBlock,
  MultiRowImage,
  SimpleGallery,
  VideoBlock,

  // Donations & Engagement
  CallToAction,
  CampaignCountdownBlock,
  DonationProgressBlock,
  DonationWidgetBlock,
  NewsletterSignupBlock,
  PricingTableBlock,
  ResourceDownloadBlock,

  // Social & Testimonials
  LogosBlock,
  ProjectTestimonialBlock,
  SocialProofBlock,
  SponsorsBlock,
  TestimonialBlock,

  // Data & Events
  AgendaBlock,
  DataGridBlock,
  LatestNewsBlock,
  MapLocationBlock,
  StatsBlock,
  UpcomingHawkEventBlock,
];

// ── Main page only ───────────────────────────────────────────
import { BentoGridBlock } from './BentoGridBlock/config';
import { InstagramBlock } from './InstagramBlock/config';
import { StepsConfigBlock } from './StepsBlock/config';

const MainPageBlocks = [...DefaultBlocks, HeroSlideshowBlock, InstagramBlock, BentoGridBlock];

export { DefaultBlocks, MainPageBlocks };

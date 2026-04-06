import AboutBlock from './AboutBlock/config';
import { AccordionBlock } from './AccordionBlock/config';
import { CallToAction } from './CallToAction/config';
import { ContentWithImage } from './ContentWithImage/config';
import { GlobalVillageAboutSectionBlock } from './GlobalVillageAboutSection/config';
import { GlobalVillageBannerBlock } from './GlobalVillageBanner/config';
import { Hero } from './Hero/config';
import { HeroWithBackgroundImage } from './HeroWithBackgroundImage/config';
import { HeroSlideshowBlock } from './HeroSlideshowBlock/config';
import { ProjectTestimonialBlock } from './ProjectTestimonialBlock/config';
import { LogosBlock } from './LogosBlock/config';
import { MediaBlock } from './MediaBlock/config';
import { TestimonialBlock } from './TestimonialBlock/config';
import { VideoBlock } from './VideoBlock/config';
import { CampaignCountdownBlock } from './CampaignCountdownBlock/config';
import { CTABannerBlock } from './CTABannerBlock/config';
import { DonationProgressBlock } from './DonationProgressBlock/config';
import { StatsBlock } from './StatsBlock/config';
import { FAQBlock } from './FAQBlock/config';
import { ImageComparisonSliderBlock } from './ImageComparisonSliderBlock/config';
import { MapLocationBlock } from './MapLocationBlock/config';
import { NewsletterSignupBlock } from './NewsletterSignupBlock/config';
import { PricingTableBlock } from './PricingTableBlock/config';
import { QuoteHighlightBlock } from './QuoteHighlightBlock/config';
import { ResourceDownloadBlock } from './ResourceDownloadBlock/config';
import { SocialProofBlock } from './SocialProofBlock/config';
import { TimelineBlock } from './TimelineBlock/config';
import MultiRowImage from './MultiRowImage/config';
import TitleDescriptionBlock from './TitleDescriptionBlock/config';
import { BentoGridBlock } from './BentoGridBlock/config';
import SimpleGallery from './SimpleGallery/config';
import { ImageShowcaseBlock } from './ImageShowcaseBlock/config';
import { DonationWidgetBlock } from './DonationWidgetBlock/config';
import { DataGridBlock } from './DataGridBlock/config';
import { WhyHereWhyNowBlock } from './WhyHereWhyNowBlock/config';
import { GrowthVisionBlock } from './GrowthVisionBlock/config';
import { LatestNewsBlock } from './LatestNewsBlock/config';
import { UpcomingHawkEventBlock } from './UpcomingHawkEventBlock/config';
import { SponsorsBlock } from './SponsorsBlock/config';
import { InstagramBlock } from './InstagramBlock/config';
import { AgendaBlock } from './AgendaBlock/config';
import { CrowdfundingImageBannerBlock } from './CrowdfundingImageBanner/config';

const DefaultBlocks = [
  AccordionBlock,
  CallToAction,
  MediaBlock,
  Hero,
  HeroWithBackgroundImage,
  ContentWithImage,
  VideoBlock,
  SimpleGallery,
  TestimonialBlock,
  ProjectTestimonialBlock,
  LogosBlock,
  AboutBlock,
  GlobalVillageAboutSectionBlock,
  GlobalVillageBannerBlock,
  CampaignCountdownBlock,
  CTABannerBlock,
  DonationProgressBlock,
  StatsBlock,
  FAQBlock,
  ImageComparisonSliderBlock,
  MapLocationBlock,
  NewsletterSignupBlock,
  PricingTableBlock,
  QuoteHighlightBlock,
  ResourceDownloadBlock,
  SocialProofBlock,
  TimelineBlock,
  MultiRowImage,
  TitleDescriptionBlock,
  ImageShowcaseBlock,
  DonationWidgetBlock,
  DataGridBlock,
  WhyHereWhyNowBlock,
  GrowthVisionBlock,
  LatestNewsBlock,
  UpcomingHawkEventBlock,
  SponsorsBlock,
  AgendaBlock,
  CrowdfundingImageBannerBlock,
];

const MainPageBlocks = [...DefaultBlocks, HeroSlideshowBlock, InstagramBlock, BentoGridBlock];

export { DefaultBlocks, MainPageBlocks };

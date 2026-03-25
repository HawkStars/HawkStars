'use client';

import './richtext.scss';

import { cn } from '@/lib/utils';

import { MediaBlock } from '@/payload/blocks/MediaBlock/Component';
import { AboutBlock } from '@/payload/blocks/AboutBlock/Component';
import { HeroBlock } from '@/payload/blocks/Hero/Component';
import { HeroWithBackgroundImageBlock } from '@/payload/blocks/HeroWithBackgroundImage/Component';
import { ContentWithImageBlock } from '@/payload/blocks/ContentWithImage/Component';
import { VideoBlock } from '@/payload/blocks/VideoBlock/Component';
import { GlobalVillageAboutSectionBlockComponent } from '@/payload/blocks/GlobalVillageAboutSection/Component';
import { TestimonialBlock } from '@/payload/blocks/TestimonialBlock/Component';
import { SerializedLinkNode, type DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react';

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
import SimpleGallery from '@/payload/blocks/SimpleGallery/Component';
import { ProjectTestimonialBlock } from '@/payload/blocks/ProjectTestimonialBlock/Component';
import { LogosBlock } from '@/payload/blocks/LogosBlock/Component';
import { GlobalVillageBannerBlockComponent } from '@/payload/blocks/GlobalVillageBanner/Component';
import { CampaignCountdownBlock } from '@/payload/blocks/CampaignCountdownBlock/Component';
import { CTABannerBlock } from '@/payload/blocks/CTABannerBlock/Component';
import { DonationProgressBlock } from '@/payload/blocks/DonationProgressBlock/Component';
import { EventListBlock } from '@/payload/blocks/EventListBlock/Component';
import { FAQBlock } from '@/payload/blocks/FAQBlock/Component';
import { ImageComparisonSliderBlock } from '@/payload/blocks/ImageComparisonSliderBlock/Component';
import { MapLocationBlock } from '@/payload/blocks/MapLocationBlock/Component';
import { NewsletterSignupBlock } from '@/payload/blocks/NewsletterSignupBlock/Component';
import { PricingTableBlock } from '@/payload/blocks/PricingTableBlock/Component';
import { QuoteHighlightBlock } from '@/payload/blocks/QuoteHighlightBlock/Component';
import { ResourceDownloadBlock } from '@/payload/blocks/ResourceDownloadBlock/Component';
import { SocialProofBlock } from '@/payload/blocks/SocialProofBlock/Component';
import { TeamGridBlock } from '@/payload/blocks/TeamGridBlock/Component';
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

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!;
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object');
  }
  const slug = value.slug;
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`;
};

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  inlineBlocks: {},
  blocks: {
    mediaBlock: ({ node }) => <MediaBlock {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    hero: ({ node }) => <HeroBlock {...node.fields} />,
    heroWithBackgroundImage: ({ node }) => <HeroWithBackgroundImageBlock {...node.fields} />,
    heroSlideshowBlock: ({ node }) => <HeroSlideshowBlock {...node.fields} />,
    contentWithImage: ({ node }) => <ContentWithImageBlock {...node.fields} />,
    videoBlock: ({ node }) => <VideoBlock {...node.fields} />,
    testimonialBlock: ({ node }) => <TestimonialBlock {...node.fields} />,
    aboutBlock: ({ node }) => <AboutBlock {...node.fields} />,
    globalVillageAboutSection: ({ node }) => (
      <GlobalVillageAboutSectionBlockComponent {...node.fields} />
    ),
    multiRowImage: ({ node }) => <MultiRowImage {...node.fields} />,
    titleDescriptionBlock: ({ node }) => <TitleDescriptionBlock {...node.fields} />,
    bentoGrid: ({ node }) => <BentoGridBlock {...node.fields} />,
    statsBlock: ({ node }) => <StatsBlock {...node.fields} />,
    accordion: ({ node }) => <AccordionBlock {...node.fields} />,
    simpleGallery: ({ node }) => <SimpleGallery {...node.fields} />,
    projectTestimonialBlock: ({ node }) => <ProjectTestimonialBlock {...node.fields} />,
    logosBlock: ({ node }) => <LogosBlock {...node.fields} />,
    globalVillageBanner: ({ node }) => <GlobalVillageBannerBlockComponent {...node.fields} />,
    campaignCountdown: ({ node }) => <CampaignCountdownBlock {...node.fields} />,
    ctaBanner: ({ node }) => <CTABannerBlock {...node.fields} />,
    donationProgress: ({ node }) => <DonationProgressBlock {...node.fields} />,
    eventList: ({ node }) => <EventListBlock {...node.fields} />,
    faq: ({ node }) => <FAQBlock {...node.fields} />,
    imageComparisonSlider: ({ node }) => <ImageComparisonSliderBlock {...node.fields} />,
    mapLocation: ({ node }) => <MapLocationBlock {...node.fields} />,
    newsletterSignup: ({ node }) => <NewsletterSignupBlock {...node.fields} />,
    pricingTable: ({ node }) => <PricingTableBlock {...node.fields} />,
    quoteHighlight: ({ node }) => <QuoteHighlightBlock {...node.fields} />,
    resourceDownload: ({ node }) => <ResourceDownloadBlock {...node.fields} />,
    socialProof: ({ node }) => <SocialProofBlock {...node.fields} />,
    teamGrid: ({ node }) => <TeamGridBlock {...node.fields} />,
    timeline: ({ node }) => <TimelineBlock {...node.fields} />,
    imageShowcase: ({ node }) => <ImageShowcaseBlock {...node.fields} />,
    donationWidget: ({ node }) => <DonationWidgetBlock {...node.fields} />,
    dataGridBlock: ({ node }) => <DataGridBlock {...node.fields} />,
    sponsorsBlock: ({ node }) => <SponsorsBlock {...node.fields} />,
    upcomingHawkEvent: ({ node }) => <UpcomingHawkEventBlock {...node.fields} />,
    latestNews: ({ node }) => <LatestNewsBlock {...node.fields} />,
    growthVisionBlock: ({ node }) => <GrowthVisionBlock {...node.fields} />,
    whyHereWhyNowBlock: ({ node }) => <WhyHereWhyNowBlock {...node.fields} />,
    instagram: ({ node }) => <InstagramBlockComponent {...node.fields} />,
  },
  list: List,
  listitem: ListItem,
  paragraph: Paragraph,
  horizontalrule: () => <hr className='bg-dark-bege mx-8 my-8 h-4 lg:mx-20' />,
  heading: Heading,
  linebreak: () => <br />,
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

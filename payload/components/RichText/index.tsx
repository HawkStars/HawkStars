import { MediaBlock } from '@/payload/blocks/MediaBlock/Component';
import { AboutBlock } from '@/payload/blocks/AboutBlock/Component';
import { HeroBlock } from '@/payload/blocks/Hero/Component';
import { HeroWithBackgroundImageBlock } from '@/payload/blocks/HeroWithBackgroundImage/Component';
import { HeroImpactStatsBlock } from '@/payload/blocks/HeroImpactStats/Component';
import { ContentWithImageBlock } from '@/payload/blocks/ContentWithImage/Component';
import { VideoBlock } from '@/payload/blocks/VideoBlock/Component';
import { ImpactBlock } from '@/payload/blocks/ImpactBlock/Component';
import { GlobalVillageAboutSectionBlockComponent } from '@/payload/blocks/GlobalVillageAboutSection/Component';
import { CardGridBlock } from '@/payload/blocks/CardGridBlock/Component';
import { TestimonialBlock } from '@/payload/blocks/TestimonialBlock/Component';
import { StatsBlock } from '@/payload/blocks/StatsBlock/Component';
import { Projects18Block } from '@/payload/blocks/Projects18/Component';
import { ProcessOneBlock } from '@/payload/blocks/ProcessOneBlock/ProcessOneBlockComponent';
import { SerializedLinkNode, type DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react';

import { CallToActionBlock } from '@/payload/blocks/CallToAction/Component';
import { cn } from '@/lib/utils';
import './richtext.scss';
import { SimpleCTABlockComponent } from '@/payload/blocks/SimpleCTA/SimpleCTAComponent';
import { SideBySideComparison } from '@/payload/blocks/ImageComparisonBlock/Component';
import List from '../utils/list';
import ListItem from '../utils/listItem';
import Paragraph from '../utils/paragraph';
import { HeroSlideshowBlock } from '@/payload/blocks/HeroSlideshowBlock/Component';
import MultiRowImage from '@/payload/blocks/MultiRowImage/Component';
import { TitleDescriptionBlock } from '@/payload/blocks/TitleDescriptionBlock/Component';
import { NodeTypes } from './config';
import BentoGridBlock from '@/payload/blocks/BentoGridBlock/Component';

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
  blocks: {
    mediaBlock: ({ node }) => (
      <MediaBlock
        className='col-span-3 col-start-1'
        imgClassName='m-0'
        {...node.fields}
        captionClassName='mx-auto max-w-[48rem]'
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    hero: ({ node }) => <HeroBlock {...node.fields} />,
    heroWithBackgroundImage: ({ node }) => <HeroWithBackgroundImageBlock {...node.fields} />,
    heroSlideshowBlock: ({ node }) => <HeroSlideshowBlock {...node.fields} />,
    heroImpactStats: ({ node }) => <HeroImpactStatsBlock {...node.fields} />,
    contentWithImage: ({ node }) => <ContentWithImageBlock {...node.fields} />,
    videoBlock: ({ node }) => <VideoBlock {...node.fields} />,
    projects18: ({ node }) => <Projects18Block {...node.fields} />,
    processOneBlock: ({ node }) => <ProcessOneBlock {...node.fields} />,
    impactBlock: ({ node }) => <ImpactBlock {...node.fields} />,
    cardGridBlock: ({ node }) => <CardGridBlock {...node.fields} />,
    testimonialBlock: ({ node }) => <TestimonialBlock {...node.fields} />,
    statsBlock: ({ node }) => <StatsBlock {...node.fields} />,
    simpleCta: ({ node }) => <SimpleCTABlockComponent {...node.fields} />,
    imageComparison: ({ node }) => <SideBySideComparison {...node.fields} />,
    aboutBlock: ({ node }) => <AboutBlock {...node.fields} />,
    globalVillageAboutSection: ({ node }) => (
      <GlobalVillageAboutSectionBlockComponent {...node.fields} />
    ),
    multiRowImage: ({ node }) => <MultiRowImage {...node.fields} />,
    titleDescriptionBlock: ({ node }) => <TitleDescriptionBlock {...node.fields} />,
    bentoGrid: ({ node }) => <BentoGridBlock {...node.fields} />,
  },
  list: List,
  listitem: ListItem,
  paragraph: Paragraph,
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

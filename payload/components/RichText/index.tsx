import { MediaBlock } from '@/payload/blocks/MediaBlock/Component';
import { GallerySliderBlock } from '@/payload/blocks/GallerySlider/Component';
import { HeroBlock } from '@/payload/blocks/Hero/Component';
import { ContentWithImageBlock } from '@/payload/blocks/ContentWithImage/Component';
import { VideoBlock } from '@/payload/blocks/VideoBlock/Component';
import { AccordionBlock } from '@/payload/blocks/AccordionBlock/Component';
import { ImpactBlock } from '@/payload/blocks/ImpactBlock/Component';
import { CardGridBlock } from '@/payload/blocks/CardGridBlock/Component';
import { TestimonialBlock } from '@/payload/blocks/TestimonialBlock/Component';
import { StatsBlock } from '@/payload/blocks/StatsBlock/Component';
import { TextBlock } from '@/payload/blocks/TextBlock/Component';
import { Projects18Block } from '@/payload/blocks/Projects18/Component';
import { ProcessOneBlock } from '@/payload/blocks/ProcessOneBlock/ProcessOneBlockComponent';
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical';
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react';

import type {
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
  GallerySliderBlock as GallerySliderProps,
  HeroBlock as HeroProps,
  ContentWithImageBlock as ContentWithImageProps,
  VideoBlock as VideoBlockProps,
  StatsBlock as StatsBlockProps,
  TestimonialBlock as TestimonialBlockProps,
  TextBlock as TextBlockProps,
  AccordionBlock as AccordionBlockProps,
  Projects18Block as Projects18BlockProps,
  ProcessOneBlock as ProcessOneBlockProps,
  ImpactBlock as ImpactBlockProps,
  CardGridBlock as CardGridBlockProps,
  ColumnBasedBlock as ColumnBasedBlockProps,
  SimpleCTABlock as SimpleCTABlockProps,
} from '@/payload-types';

import { CallToActionBlock } from '@/payload/blocks/CallToAction/Component';
import { cn } from '@/lib/utils';
import './richtext.scss';
import { ColumnBasedBlock } from '@/payload/blocks/ColumnBased/Component';
import { SimpleCTABlockComponent } from '@/payload/blocks/SimpleCTA/SimpleCTAComponent';

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | CTABlockProps
      | MediaBlockProps
      | GallerySliderProps
      | HeroProps
      | ContentWithImageProps
      | VideoBlockProps
      | TestimonialBlockProps
      | StatsBlockProps
      | TextBlockProps
      | AccordionBlockProps
      | Projects18BlockProps
      | ProcessOneBlockProps
      | ImpactBlockProps
      | CardGridBlockProps
      | ColumnBasedBlockProps
      | SimpleCTABlockProps
    >;

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  debugger;
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
    gallerySlider: ({ node }) => <GallerySliderBlock {...node.fields} />,
    hero: ({ node }) => <HeroBlock {...node.fields} />,
    contentWithImage: ({ node }) => <ContentWithImageBlock {...node.fields} />,
    videoBlock: ({ node }) => <VideoBlock {...node.fields} />,
    accordionBlock: ({ node }) => <AccordionBlock {...node.fields} />,
    projects18: ({ node }) => <Projects18Block {...node.fields} />,
    processOneBlock: ({ node }) => <ProcessOneBlock {...node.fields} />,
    impactBlock: ({ node }) => <ImpactBlock {...node.fields} />,
    cardGridBlock: ({ node }) => <CardGridBlock {...node.fields} />,
    testimonialBlock: ({ node }) => <TestimonialBlock {...node.fields} />,
    statsBlock: ({ node }) => <StatsBlock {...node.fields} />,
    textBlock: ({ node }) => <TextBlock {...node.fields} />,
    columnBased: ({ node }) => <ColumnBasedBlock {...node.fields} />,
    simpleCta: ({ node }) => <SimpleCTABlockComponent {...node.fields} />,
  },
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

import { MediaBlock } from '@/payload/blocks/MediaBlock/Component';
import { GallerySliderBlock } from '@/payload/blocks/GallerySlider/Component';
import { HeroBlock } from '@/payload/blocks/Hero/Component';
import { ContentWithImageBlock } from '@/payload/blocks/ContentWithImage/Component';
import { VideoBlock } from '@/payload/blocks/VideoBlock/Component';
import { AccordionBlock } from '@/payload/blocks/AccordionBlock/Component';
import { ProjectBlock } from '@/payload/blocks/ProjectBlock/Component';
import { ImpactBlock } from '@/payload/blocks/ImpactBlock/Component';
import { CardGridBlock } from '@/payload/blocks/CardGridBlock/Component';
import { TestimonialBlock } from '@/payload/blocks/TestimonialBlock/Component';
import { StatsBlock } from '@/payload/blocks/StatsBlock/Component';
import { TextBlock } from '@/payload/blocks/TextBlock/Component';
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
  ProjectBlock as ProjectBlockProps,
  ImpactBlock as ImpactBlockProps,
  CardGridBlock as CardGridBlockProps,
  ColumnBasedBlock as ColumnBasedBlockProps,
} from '@/payload-types';

import { CallToActionBlock } from '@/payload/blocks/CallToAction/Component';
import { cn } from '@/lib/utils';
import './richtext.scss';
import { ColumnBasedBlock } from '@/payload/blocks/ColumnBased/Component';

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
      | ProjectBlockProps
      | ImpactBlockProps
      | CardGridBlockProps
      | ColumnBasedBlockProps
    >;

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
    gallerySlider: ({ node }) => <GallerySliderBlock {...node.fields} />,
    hero: ({ node }) => <HeroBlock {...node.fields} />,
    contentWithImage: ({ node }) => <ContentWithImageBlock {...node.fields} />,
    videoBlock: ({ node }) => <VideoBlock {...node.fields} />,
    accordionBlock: ({ node }) => <AccordionBlock {...node.fields} />,
    projectBlock: ({ node }) => <ProjectBlock {...node.fields} />,
    impactBlock: ({ node }) => <ImpactBlock {...node.fields} />,
    cardGridBlock: ({ node }) => <CardGridBlock {...node.fields} />,
    testimonialBlock: ({ node }) => <TestimonialBlock {...node.fields} />,
    statsBlock: ({ node }) => <StatsBlock {...node.fields} />,
    textBlock: ({ node }) => <TextBlock {...node.fields} />,
    columnBased: ({ node }) => <ColumnBasedBlock {...node.fields} />,
  },
});

type Props = {
  data: DefaultTypedEditorState;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  const { className, ...rest } = props;
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn('payload-richtext', className)}
      {...rest}
    />
  );
}

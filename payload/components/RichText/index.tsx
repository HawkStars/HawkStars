import { MediaBlock } from '@/payload/blocks/MediaBlock/Component';
import { GallerySliderBlock } from '@/payload/blocks/GallerySlider/Component';
import { HeroBlock } from '@/payload/blocks/Hero/Component';
import { ContentWithImageBlock } from '@/payload/blocks/ContentWithImage/Component';
import { VideoBlock } from '@/payload/blocks/VideoBlock/Component';
import { TextBlock } from '@/payload/blocks/TextBlock/Component';
import { AccordionBlock } from '@/payload/blocks/AccordionBlock/Component';
import { ProjectBlock } from '@/payload/blocks/ProjectBlock/Component';
import { ImpactBlock } from '@/payload/blocks/ImpactBlock/Component';
import { CardGridBlock } from '@/payload/blocks/CardGridBlock/Component';
import { TestimonialBlock } from '@/payload/blocks/TestimonialBlock/Component';
import { StatsBlock } from '@/payload/blocks/StatsBlock/Component';
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
} from '@/payload-types';

// Temporary types for new blocks until we regenerate payload-types
interface TextBlockProps {
  content: any;
  textAlign?: string;
  maxWidth?: string;
}

interface AccordionBlockProps {
  items?: any[];
  allowMultipleOpen?: boolean;
  style?: string;
}

interface ProjectBlockProps {
  [key: string]: any;
}

interface ImpactBlockProps {
  [key: string]: any;
}

interface CardGridBlockProps {
  [key: string]: any;
}

interface TestimonialBlockProps {
  [key: string]: any;
}

interface StatsBlockProps {
  [key: string]: any;
}

import { CallToActionBlock } from '@/payload/blocks/CallToAction/Component';
import { cn } from '@/payload/utilities/ui';

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | CTABlockProps
      | MediaBlockProps
      | GallerySliderProps
      | HeroProps
      | ContentWithImageProps
      | VideoBlockProps
      | TextBlockProps
      | AccordionBlockProps
      | ProjectBlockProps
      | ImpactBlockProps
      | CardGridBlockProps
      | TestimonialBlockProps
      | StatsBlockProps
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
    textBlock: ({ node }: { node: any }) => <TextBlock {...node.fields} />,
    accordionBlock: ({ node }: { node: any }) => <AccordionBlock {...node.fields} />,
    projectBlock: ({ node }: { node: any }) => <ProjectBlock {...node.fields} />,
    impactBlock: ({ node }: { node: any }) => <ImpactBlock {...node.fields} />,
    cardGridBlock: ({ node }: { node: any }) => <CardGridBlock {...node.fields} />,
    testimonialBlock: ({ node }: { node: any }) => <TestimonialBlock {...node.fields} />,
    statsBlock: ({ node }: { node: any }) => <StatsBlock {...node.fields} />,
  },
});

type Props = {
  data: DefaultTypedEditorState;
  enableGutter?: boolean;
  enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props;
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'prose md:prose-md dark:prose-invert mx-auto': enableProse,
        },
        className
      )}
      {...rest}
    />
  );
}

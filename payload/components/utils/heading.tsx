import { cn } from '@/lib/utils';
import { SerializedHeadingNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';

const classHeadings = {
  h1: 'text-h1_semibold my-6',
  h2: 'text-h2_bold my-6',
  h3: 'text-h2_light my-4',
  h4: 'text-xl md:text-2xl my-4',
  h5: 'text-lg md:text-xl my-3',
  h6: 'text-base md:text-lg font-light my-3',
};

const Heading: JSXConverter<SerializedHeadingNode> = ({ converters, node, nodesToJSX, parent }) => {
  const children = nodesToJSX({
    converters,
    nodes: node.children,
    parent: { ...node, parent },
  });

  const tag = node.tag;
  switch (tag) {
    case 'h1':
      return <h1 className={cn(classHeadings[tag])}>{children}</h1>;
    case 'h2':
      return <h2 className={cn(classHeadings[tag])}>{children}</h2>;
    case 'h3':
      return <h3 className={cn(classHeadings[tag])}>{children}</h3>;
    case 'h4':
      return <h4 className={cn(classHeadings[tag])}>{children}</h4>;
    case 'h5':
      return <h5 className={cn(classHeadings[tag])}>{children}</h5>;
    case 'h6':
      return <h6 className={cn(classHeadings[tag])}>{children}</h6>;
    default:
      return <></>;
  }
};

export default Heading;

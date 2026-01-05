import { cn } from '@/lib/utils';
import { SerializedHeadingNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';

const Heading: JSXConverter<SerializedHeadingNode> = ({ converters, node, nodesToJSX, parent }) => {
  const children = nodesToJSX({
    converters,
    nodes: node.children,
    parent: { ...node, parent },
  });

  return <p className={cn('text-body mx-3 mt-1')}>{children}</p>;
};

export default Heading;

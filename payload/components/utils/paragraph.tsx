import { cn } from '@/lib/utils';
import { SerializedParagraphNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';

const Paragraph: JSXConverter<SerializedParagraphNode> = ({
  converters,
  node,
  nodesToJSX,
  parent,
}) => {
  const children = nodesToJSX({
    converters,
    nodes: node.children,
    parent: { ...node, parent },
  });

  return <p className={cn('text-body mx-3')}>{children}</p>;
};

export default Paragraph;

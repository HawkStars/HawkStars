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

  const indent = node.indent || 0;
  if (children.length === 0) return <br />;
  return (
    <p
      className={cn('text-body my-1 text-justify', {
        [`max-lg:mx-${(indent + 1) * 1} mx-${(indent + 1) * 2}`]: indent > 0,
      })}
    >
      {children}
    </p>
  );
};

export default Paragraph;

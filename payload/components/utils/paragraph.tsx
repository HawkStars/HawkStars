import { cn } from '@/lib/utils';
import { SerializedParagraphNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';

// Node types that render block-level HTML and are therefore invalid inside a <p>.
// If a paragraph contains any of these (e.g. a horizontal rule), we must not wrap
// it in <p>, or React 19 throws a hydration error ("<hr> cannot be a descendant of <p>").
const BLOCK_LEVEL_CHILD_TYPES = new Set(['horizontalrule', 'block', 'upload', 'list']);

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

  const margin = `max-lg:mx-${(indent + 1) * 1}`;
  const className = cn('text-body mx-auto my-1 max-w-6xl', margin);

  const hasBlockLevelChild = node.children?.some((child) =>
    BLOCK_LEVEL_CHILD_TYPES.has(child.type)
  );

  const Wrapper = hasBlockLevelChild ? 'div' : 'p';
  return <Wrapper className={className}>{children}</Wrapper>;
};

export default Paragraph;

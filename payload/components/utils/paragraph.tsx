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

  // Static, literal indent classes so Tailwind can detect them at build time.
  // Dynamic string interpolation (e.g. `px-${n}`) is NOT picked up by the
  // Tailwind scanner and produces no CSS.
  const INDENT_CLASSES = [
    'px-2 lg:px-1',
    'px-4 lg:px-2',
    'px-6 lg:px-3',
    'px-8 lg:px-4',
    'px-10 lg:px-5',
  ];
  const margin = INDENT_CLASSES[Math.min(indent, INDENT_CLASSES.length - 1)];
  const className = cn('text-body_regular mx-auto my-1', margin);

  const hasBlockLevelChild = node.children?.some((child) =>
    BLOCK_LEVEL_CHILD_TYPES.has(child.type)
  );

  const Wrapper = hasBlockLevelChild ? 'div' : 'p';
  return <Wrapper className={className}>{children}</Wrapper>;
};

export default Paragraph;

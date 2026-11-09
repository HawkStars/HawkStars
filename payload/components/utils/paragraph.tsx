import { SerializedParagraphNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';
import { proseStyle } from './nodeText';

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

  // Paragraph spacing comes from the stylesheet, so empty paragraphs (editors pressing
  // Enter twice for space) render nothing instead of an uneven gap.
  if (children.length === 0) return null;

  const hasBlockLevelChild = node.children?.some((child) =>
    BLOCK_LEVEL_CHILD_TYPES.has(child.type)
  );

  // Payload applies the editor's alignment and indent as inline styles.
  const Wrapper = hasBlockLevelChild ? 'div' : 'p';
  return (
    <Wrapper className='rt-column rt-text rt-p' style={proseStyle(node)}>
      {children}
    </Wrapper>
  );
};

export default Paragraph;

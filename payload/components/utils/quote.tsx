import { SerializedQuoteNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';
import { proseStyle } from './nodeText';

/** Lexical quote → pull quote on the reading column (see `.rt-quote`). */
const Quote: JSXConverter<SerializedQuoteNode> = ({ converters, node, nodesToJSX, parent }) => {
  const children = nodesToJSX({
    converters,
    nodes: node.children,
    parent: { ...node, parent },
  });

  if (children.length === 0) return null;

  return (
    <div className='rt-column' style={proseStyle(node)}>
      <blockquote className='rt-quote'>{children}</blockquote>
    </div>
  );
};

export default Quote;

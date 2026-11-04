import { SerializedQuoteNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';
import { noJustify } from './nodeText';

/** Lexical quote → pull quote on the reading column (see `.rt-quote`). */
const Quote: JSXConverter<SerializedQuoteNode> = ({ converters, node, nodesToJSX, parent }) => {
  const children = nodesToJSX({
    converters,
    nodes: node.children,
    parent: { ...node, parent },
  });

  if (children.length === 0) return null;

  return (
    <div className='rt-column'>
      <blockquote className='rt-quote' style={noJustify(node)}>
        {children}
      </blockquote>
    </div>
  );
};

export default Quote;

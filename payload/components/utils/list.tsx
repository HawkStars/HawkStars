import { cn } from '@/lib/utils';
import { SerializedListNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';

const LIST_CLASSES: Record<string, string> = {
  number: 'rt-list rt-list-number list-decimal',
  bullet: 'rt-list list-disc',
  check: 'rt-list rt-list-check',
};

const List: JSXConverter<SerializedListNode> = ({ converters, node, nodesToJSX, parent }) => {
  const children = nodesToJSX({
    converters,
    nodes: node.children,
    parent: { ...node, parent },
  });

  if (!children || children.length === 0) return null;

  const Tag = node.listType === 'number' ? 'ol' : 'ul';
  // Top-level lists sit on the reading column; nested ones inside their list item.
  const isNested = parent.type === 'listitem';

  return (
    <Tag
      className={cn('rt-text', LIST_CLASSES[node.listType] ?? LIST_CLASSES.bullet, {
        'rt-column': !isNested,
      })}
    >
      {children}
    </Tag>
  );
};

export default List;

import { cn } from '@/lib/utils';
import { SerializedListNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';

const List: JSXConverter<SerializedListNode> = ({ converters, node, nodesToJSX, parent }) => {
  const children = nodesToJSX({
    converters,
    nodes: node.children,
    parent: { ...node, parent },
  });

  const indent = node.indent || 0;

  switch (node.listType) {
    case 'number':
      return (
        <ol
          className={cn('my-1 flex list-decimal flex-col gap-3 px-6', {
            'ml-4': indent === 0,
          })}
        >
          {children}
        </ol>
      );
    case 'bullet':
      return (
        <ul
          className={cn('my-1 flex list-disc flex-col gap-3 px-6', {
            'ml-4': indent === 0,
          })}
        >
          {children}
        </ul>
      );
    default:
      return (
        <ul
          className={cn('my-1 flex flex-col gap-3 px-6', {
            'ml-4': indent === 0,
          })}
        >
          {children}
        </ul>
      );
  }
};

export default List;

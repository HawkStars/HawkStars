import { cn } from '@/lib/utils';
import { SerializedListNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';
import { ReactNode } from 'react';

const List: JSXConverter<SerializedListNode> = ({ converters, node, nodesToJSX, parent }) => {
  const children = nodesToJSX({
    converters,
    nodes: node.children,
    parent: { ...node, parent },
  });

  const indent = node.indent || 0;
  if (!children || children.length === 0) return null;

  const hasNestedList = children.every((child) => {
    const props = (child as unknown as { props: ReactNode[] })?.props as unknown as {
      children: ReactNode[];
    };

    const hasList = props.children?.filter((p: unknown) => {
      if (p instanceof Array) {
        return (
          p.filter(
            (item: { type: string }) =>
              item instanceof Object && 'type' in item && ['ul', 'ol'].includes(item.type)
          )?.length > 0
        );
      }
      return false;
    });

    return hasList && hasList.length > 0;
  });

  switch (node.listType) {
    case 'number':
      return (
        <ol
          className={cn('mx-6 my-1 flex flex-col gap-3 px-4 max-lg:mx-5', {
            'list-decimal': !hasNestedList,
            'mx-0!': parent.type === 'listitem',
          })}
          data-type={parent.type}
        >
          {children}
        </ol>
      );
    case 'bullet':
      return (
        <ul
          className={cn('mx-6 my-1 flex flex-col gap-3 px-4 max-lg:mx-5', {
            'list-disc': !hasNestedList,
            'mx-0!': parent.type === 'listitem',
          })}
          data-type={parent.type}
        >
          {children}
        </ul>
      );
    default:
      return (
        <ul className={cn('my-1 flex flex-col gap-3 px-8 max-lg:px-3', {})} data-type='test'>
          {children}
        </ul>
      );
  }
};

export default List;

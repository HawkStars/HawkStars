import { cn } from '@/lib/utils';
import { SerializedListItemNode, SerializedListNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';

const ListItem: JSXConverter<SerializedListItemNode> = ({
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

  const list = parent as SerializedListNode;
  const indent = node.indent || 0;
  const listType = list.listType;
  const checked = node.checked;

  const isCheckItem = checked !== undefined && listType === 'check';

  return (
    <li
      className={cn('', {
        'text-body_regular': indent === 0 && listType === 'number',
      })}
    >
      {isCheckItem ? (
        <input
          type='checkbox'
          className='mr-2'
          checked={checked}
          name={node.value?.toString()}
          readOnly
        />
      ) : null}
      {children}
    </li>
  );
};

export default ListItem;

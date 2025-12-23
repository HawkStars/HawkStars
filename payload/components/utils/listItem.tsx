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

  return (
    <li
      className={cn('', {
        'text-h2_bold': indent === 0 && listType === 'number',
      })}
      style={{ marginLeft: `${(indent + 1) * 8}px` }}
    >
      {checked !== undefined && listType === 'check' ? (
        <input type='checkbox' checked={checked} name={node.value.toString()} readOnly />
      ) : null}{' '}
      {children}
    </li>
  );
};

export default ListItem;

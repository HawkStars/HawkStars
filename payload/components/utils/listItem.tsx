import { cn } from '@/lib/utils';
import { SerializedListItemNode, SerializedListNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';
import { noJustify } from './nodeText';

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

  const listType = (parent as SerializedListNode).listType;

  // Lexical nests a list inside an otherwise empty item; that item must not show a marker.
  const onlyHoldsList =
    node.children.length > 0 && node.children.every((child) => child.type === 'list');

  if (listType === 'check' && !onlyHoldsList) {
    const checked = Boolean(node.checked);
    return (
      <li style={noJustify(node)}>
        <input type='checkbox' className='sr-only' checked={checked} readOnly />
        <span className='rt-check' data-checked={checked} aria-hidden='true'>
          {checked ? '✓' : null}
        </span>
        <span>{children}</span>
      </li>
    );
  }

  return (
    <li
      className={cn('pl-1', { 'list-none': onlyHoldsList })}
      value={listType === 'number' ? node.value : undefined}
      style={noJustify(node)}
    >
      {children}
    </li>
  );
};

export default ListItem;

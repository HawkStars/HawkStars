import { cn } from '@/lib/utils';
import { SerializedHeadingNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';
import { getNodeText, proseStyle, slugifyHeading } from './nodeText';

// Same rank mapping as SectionHeader. More space above than below, so a heading
// sits with the text it introduces rather than the paragraph before it.
const classHeadings = {
  h1: 'text-h1_semibold mt-16 mb-5',
  h2: 'text-h2_semibold mt-14 mb-4',
  h3: 'text-h2_bold mt-10 mb-3',
  h4: 'text-h3_semibold mt-8 mb-2',
  // h5/h6 keep their earlier light treatment: existing pages use them as styled body copy.
  h5: 'mt-6 mb-3 text-lg lg:text-xl',
  h6: 'mt-6 mb-3 text-base font-light lg:text-lg',
};

// Section-level headings get an id and a hover "#" link so long pages can be deep-linked.
const ANCHORED = new Set(['h2', 'h3']);

const Heading: JSXConverter<SerializedHeadingNode> = ({ converters, node, nodesToJSX, parent }) => {
  const children = nodesToJSX({
    converters,
    nodes: node.children,
    parent: { ...node, parent },
  });

  const Tag = node.tag;
  if (!(Tag in classHeadings)) return <>{children}</>;

  // An empty heading (an editor's leftover line) still carried its top margin —
  // up to 64px of blank space between blocks. Headings hold only inline text.
  if (!getNodeText(node).trim()) return null;

  const id = ANCHORED.has(Tag) ? slugifyHeading(getNodeText(node)) || undefined : undefined;

  return (
    <Tag
      id={id}
      className={cn('rt-column rt-heading first:mt-0', classHeadings[Tag])}
      style={proseStyle(node)}
    >
      {children}
      {id && (
        <a href={`#${id}`} className='rt-anchor' aria-label={getNodeText(node)}>
          #
        </a>
      )}
    </Tag>
  );
};

export default Heading;

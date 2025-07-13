import { BlockProps } from 'sanity';

type AccordionBlockProps = BlockProps & {
  title?: unknown;
};

const AccordionBlock = (props: AccordionBlockProps) => {
  const { title, children } = props;
  return (
    <details style={{ margin: '16px 0', border: '1px solid #ddd' }}>
      {children}
      <summary style={{ padding: '8px' }}>{(title as string) || 'Accordion'}</summary>
      <div style={{ padding: '16px' }}>{children}</div>
    </details>
  );
};

export default AccordionBlock;

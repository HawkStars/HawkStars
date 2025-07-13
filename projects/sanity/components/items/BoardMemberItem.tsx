export const BlockComponent = (props: any) => {
  debugger;
  // Add extra padding to all text blocks
  if (props.schemaType.name === 'block') {
    return (
      <div style={{ padding: '2px' }}>
        <p>aaaa</p>
        {props.renderDefault(props)}
      </div>
    );
  }
  // Inline editing of images
  if (props.schemaType.name === 'image') {
    return props.renderDefault({
      ...props,
      renderPreview: () => props.children,
    });
  }

  console.log(props);
  return <p>12123</p>;
  // Render default for all other types
  return props.renderDefault(props);
};

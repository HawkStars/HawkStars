const AccordionPreview = (props: any) => {
  const { title, content } = props;

  return (
    <div className='flex flex-col'>
      <h6>{title}</h6>
      <div>{content}</div>
    </div>
  );
};

export default AccordionPreview;

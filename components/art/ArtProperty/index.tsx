type ArtPropertyComponentProps = {
  label: string;
  value?: string | number | null;
};

const ArtPropertyComponent = ({ label, value }: ArtPropertyComponentProps) => {
  if (!value) return <></>;

  return (
    <div className='font-oswald flex flex-col gap-3'>
      <h6 className='text-h2_bold'>{label}</h6>
      <p className='text-h2_light'>{value}</p>
    </div>
  );
};

export default ArtPropertyComponent;

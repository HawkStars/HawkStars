import { FieldLabelServerProps, GroupField, GroupFieldClient } from 'payload';

const PayloadImageLabel = ({ field }: FieldLabelServerProps<GroupField, GroupFieldClient>) => {
  const { label } = field;
  if (!label) return null;
  // Get the platform name or use a fallback
  return (
    <div className='undeline text-lg' style={{ textTransform: 'capitalize' }}>
      {label as string}
    </div>
  );
};

export default PayloadImageLabel;

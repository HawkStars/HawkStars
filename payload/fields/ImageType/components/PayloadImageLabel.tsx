import { getTranslation } from '@payloadcms/translations';
import { FieldLabelServerProps, GroupField, GroupFieldClient } from 'payload';

/**
 * Label for `PayloadImageField` groups. The label may be a plain string or a
 * per-language object ({ en, pt }), so it is resolved for the admin's language.
 */
const PayloadImageLabel = ({
  field,
  i18n,
}: FieldLabelServerProps<GroupField, GroupFieldClient>) => {
  const { label } = field;
  if (!label) return null;

  return (
    <div className='undeline text-lg' style={{ textTransform: 'capitalize' }}>
      {getTranslation(label, i18n)}
    </div>
  );
};

export default PayloadImageLabel;

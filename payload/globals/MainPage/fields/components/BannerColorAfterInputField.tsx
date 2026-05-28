'use client';
import type { SelectFieldLabelClientComponent } from 'payload';

import { useField } from '@payloadcms/ui';

const BannerColorField: SelectFieldLabelClientComponent = (props) => {
  const { path } = props;
  const data = useField({ path });
  const { value } = data;

  return (
    <div className='field-type select flex gap-2'>
      <div
        className='mt-2 h-8 w-8'
        style={{
          backgroundColor: (value as string) || 'transparent',
        }}
      ></div>
    </div>
  );
};

export default BannerColorField;

'use client';
import type { SelectFieldClientComponent } from 'payload';

import { SelectField } from '@payloadcms/ui';
import { icons, LucideIcon } from 'lucide-react';
import { useState } from 'react';

const IconSelectField: SelectFieldClientComponent = (props) => {
  const { field, value, path } = props;
  const [selectedIcon, setSelectedIcon] = useState<string>((value as string) || 'Star');

  const IconComponent = selectedIcon
    ? (icons[selectedIcon as keyof typeof icons] as LucideIcon)
    : null;

  const handleIconChange = (newValue: string | string[]) => {
    const iconValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setSelectedIcon(iconValue);
  };

  return (
    <div className='field-type select flex gap-2'>
      {IconComponent && (
        <div
          style={{
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconComponent size={24} strokeWidth={2} />
        </div>
      )}
      <SelectField
        forceRender={true}
        field={{ ...field }}
        path={path}
        value={selectedIcon || ''}
        onChange={handleIconChange}
      />
    </div>
  );
};

export default IconSelectField;

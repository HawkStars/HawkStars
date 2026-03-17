'use client';
import type { SelectFieldClientComponent } from 'payload';

import { SelectField, useField } from '@payloadcms/ui';
import { icons, LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

const IconSelectField: SelectFieldClientComponent = (props) => {
  const { field, path } = props;
  const data = useField({ path });
  const { initialValue } = data;

  const [selectedIcon, setSelectedIcon] = useState<string>(initialValue as string);

  const handleIconChange = (newValue: string | string[]) => {
    const iconValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setSelectedIcon(iconValue);
  };

  const IconComponent = useMemo(() => {
    if (!selectedIcon) return null;

    return icons[selectedIcon as keyof typeof icons] as LucideIcon;
  }, [selectedIcon]);

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

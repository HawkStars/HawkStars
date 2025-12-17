'use client';

import { LinkField, NavbarDropdown } from '@/payload-types';
import { useRowLabel } from '@payloadcms/ui';

const HeaderLabel = () => {
  const { data } = useRowLabel<{
    isMultiColumn?: boolean | null;
    link?: LinkField;
    dropdown?: NavbarDropdown;
    id?: string | null;
  }>();
  const isMultiColumn = data?.isMultiColumn;
  const title = isMultiColumn ? data?.dropdown?.dropdownTitle : data?.link?.label;

  // Get the platform name or use a fallback
  return (
    <div style={{ textTransform: 'capitalize' }}>
      {isMultiColumn ? `Menu ${title || ''}` : title || 'Menu'}
    </div>
  );
};

export default HeaderLabel;

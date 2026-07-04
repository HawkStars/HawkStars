'use client';

import { SocialIcon } from '@/utils/models/social';
import { useRowLabel } from '@payloadcms/ui';
import Image from 'next/image';

const ReportsRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{
    platform: string;
    label: string;
  }>();

  const icon = SocialIcon[data?.platform as keyof typeof SocialIcon];
  if (icon) {
    return (
      <div className='flex items-center gap-2'>
        <Image src={icon as string} alt='' width={24} height={24} className='grayscale' />
        <span>{data?.label || `Report ${rowNumber ?? 0 + 1}`}</span>
      </div>
    );
  }

  const rowLabel = `${data?.platform || ' - '} ${data?.label || `Report ${rowNumber ?? 0 + 1}`}`;
  return <div style={{ textTransform: 'capitalize' }}>{rowLabel}</div>;
};

export default ReportsRowLabel;

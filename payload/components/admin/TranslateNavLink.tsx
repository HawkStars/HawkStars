'use client';

import { useConfig } from '@payloadcms/ui';
import { formatAdminURL } from '@payloadcms/ui/shared';
import Link from 'next/link';

const TranslateNavLink = () => {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig();

  const href = formatAdminURL({ adminRoute, path: '/translate' });

  return (
    <div style={{ padding: '0 4px', marginTop: '8px' }}>
      <Link
        href={href}
        className='rounded-sm text-sm no-underline'
        style={{ color: 'var(--theme-text)' }}
      >
        🌐 Traduzir PT ⇄ EN
      </Link>
    </div>
  );
};

export default TranslateNavLink;

'use client';

import { Button } from '@payloadcms/ui';
import { handleRefreshToken } from '../server/refreshToken';

const RefreshTokenButton = () => {
  return <Button onClick={handleRefreshToken}>Refresh Google Token</Button>;
};

export default RefreshTokenButton;

import canUseDOM from './canUseDOM';
import { BASE_URL } from '@/lib/constants';

export const getServerSideURL = () => {
  return BASE_URL;
};

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol;
    const domain = window.location.hostname;
    const port = window.location.port;

    return `${protocol}//${domain}${port ? `:${port}` : ''}`;
  }

  return BASE_URL;
};

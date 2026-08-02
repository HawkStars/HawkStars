import * as Sentry from '@sentry/nextjs';

type PayloadClientProps<T> = {
  url: string;
  query: string;
  method: 'GET';
  fallback: T;
  controller?: AbortController;
  singleValue?: boolean;
};

const payloadClientQuery = async <T>(props: PayloadClientProps<T>): Promise<T> => {
  const { url, query, method, fallback, controller, singleValue } = props;
  try {
    const response = await fetch(`${url}${query}`, { method, signal: controller?.signal });

    if (!response.ok) return fallback as T;
    const data = await response.json();

    if (singleValue) {
      return (data?.docs?.[0] as unknown as T) ?? (fallback as T);
    }

    return (data?.docs as unknown as T) ?? (fallback as T);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return fallback as T;

    Sentry.captureException(error, { extra: { url, query } });
    return fallback as T;
  }
};

export default payloadClientQuery;

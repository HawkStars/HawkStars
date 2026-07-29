import { DefaultTemplate } from '@payloadcms/next/templates';
import type { AdminViewServerProps } from 'payload';
import TranslateWidget from './TranslateWidget';

/**
 * Root-level admin view registered at admin.components.views.translate
 * (see payload.config.ts, path `/translate`). Must be a Server Component:
 * DefaultTemplate needs the full server-only props from `initPageResult`
 * (req, permissions, visibleEntities, ...), which are not forwarded across
 * the client-component boundary. The actual interactive tool lives in
 * ./TranslateWidget as a client component rendered as children here.
 */
export function TranslateView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const {
    req,
    req: { payload, user },
    locale,
    permissions,
    visibleEntities,
  } = initPageResult;

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user || undefined}
      visibleEntities={visibleEntities}
    >
      <TranslateWidget />
    </DefaultTemplate>
  );
}

export default TranslateView;

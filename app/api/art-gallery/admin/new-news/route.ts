import * as Sentry from '@sentry/nextjs';
import { getPayloadConfig } from '@/lib/payload/server';

/**
 * "+ Nova notícia" in the admin's "Notícias da Galeria de Arte": creates a
 * draft News article already marked "Mostrar na Galeria de Arte" and opens it
 * in the regular News editor (all the same fields as any HawkStars article).
 * Only for logged-in admin users.
 */
export async function GET(request: Request) {
  const payload = await getPayloadConfig();
  const adminRoute = payload.config.routes.admin;
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return Response.redirect(new URL(`${adminRoute}/login`, request.url), 303);

  try {
    const draft = await payload.create({
      collection: 'news',
      draft: true,
      user,
      overrideAccess: false,
      data: {
        title: 'Nova notícia da galeria',
        type: 'news',
        slug: `galeria-${Date.now().toString(36)}`,
        showInArtGallery: true,
      },
    });
    return Response.redirect(
      new URL(`${adminRoute}/collections/news/${draft.id}`, request.url),
      303
    );
  } catch (error) {
    Sentry.captureException(error);
    return Response.redirect(new URL(`${adminRoute}/globals/artGalleryNews`, request.url), 303);
  }
}

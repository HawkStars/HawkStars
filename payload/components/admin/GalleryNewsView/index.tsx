import type { DocumentViewServerProps } from 'payload';
import Link from 'next/link';
import { Gutter } from '@payloadcms/ui';

const NEWS_TYPE_LABELS: Record<string, string> = {
  blog: 'Blog',
  news: 'Notícia',
  press_release: 'Comunicado de Imprensa',
  announcement: 'Anúncio',
  other: 'Outro',
};

const cell = { padding: '12px 16px', borderBottom: '1px solid var(--theme-elevation-100)' };

/**
 * Edit view of the `artGalleryNews` global: lists the News articles in the
 * gallery feed (drafts included) with links to edit them in the News
 * collection. Rendered inside Payload's default admin template (with the nav).
 */
export async function GalleryNewsView({ initPageResult }: DocumentViewServerProps) {
  const { payload } = initPageResult.req;
  const adminRoute = payload.config.routes.admin;

  const { docs } = await payload.find({
    collection: 'news',
    where: { showInArtGallery: { equals: true } },
    sort: '-publishedAt',
    limit: 100,
    depth: 0,
    draft: true,
    locale: 'pt',
  });

  const newsListUrl = `${adminRoute}/collections/news?where[showInArtGallery][equals]=true`;

  return (
    <Gutter>
      <div style={{ padding: '32px 0 16px' }}>
        <h1 style={{ margin: 0 }}>Notícias da Galeria de Arte</h1>
        <p style={{ color: 'var(--theme-elevation-500)', marginTop: 8 }}>
          As notícias com “Mostrar na Galeria de Arte” ativo aparecem em <code>/art/news</code>.
          Clique numa notícia para a editar. Uma notícia criada aqui já fica marcada para a galeria
          — basta preencher e publicar.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
          {/* An API route (creates the draft, then redirects), not a page: it needs a full request. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            className='btn btn--style-primary btn--size-small'
            href='/api/art-gallery/admin/new-news'
          >
            + Nova notícia
          </a>
          <Link className='btn btn--style-secondary btn--size-small' href={newsListUrl}>
            Abrir na lista de Notícias (filtrada)
          </Link>
        </div>
      </div>

      {docs.length === 0 ? (
        <p style={{ padding: '24px 0' }}>Ainda não há notícias na galeria.</p>
      ) : (
        <div style={{ overflowX: 'auto', paddingBottom: 48 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--theme-elevation-500)' }}>
                <th style={cell}>Título</th>
                <th style={cell}>Tipo</th>
                <th style={cell}>Estado</th>
                <th style={cell}>Publicado em</th>
                <th style={cell}>No site</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((article) => (
                <tr key={article.id}>
                  <td style={cell}>
                    <Link href={`${adminRoute}/collections/news/${article.id}`}>
                      {article.title}
                    </Link>
                  </td>
                  <td style={cell}>{NEWS_TYPE_LABELS[article.type] ?? article.type}</td>
                  <td style={cell}>{article._status === 'published' ? 'Publicado' : 'Rascunho'}</td>
                  <td style={cell}>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString('pt-PT')
                      : '—'}
                  </td>
                  <td style={cell}>
                    {article._status === 'published' ? (
                      <a href={`/pt/art/news/${article.slug}`} target='_blank' rel='noreferrer'>
                        Ver ↗
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Gutter>
  );
}

export default GalleryNewsView;

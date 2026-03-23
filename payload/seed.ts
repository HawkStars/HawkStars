import path from 'path';
import type { Payload } from 'payload';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Seed script to populate all Payload CMS collections with sample data.
 *
 * Usage:
 *   1. Import and call from payload.config.ts onInit:
 *      onInit: async (payload) => { await seed(payload); }
 *
 *   2. Or run standalone via the custom endpoint/script.
 *
 * ⚠️  This will skip creation if documents already exist in each collection.
 */
export async function seed(payload: Payload): Promise<void> {
  payload.logger.info('🌱 Starting seed...');

  // ── 1. Users ──────────────────────────────────────────────────────────────
  const existingUsers = await payload.count({ collection: 'users' });
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Admin',
        email: 'admin@hawkstars.org',
        password: 'changeme123',
        isAdmin: true,
        isEditor: false,
      },
    });

    await payload.create({
      collection: 'users',
      data: {
        name: 'Editor',
        email: 'editor@hawkstars.org',
        password: 'changeme123',
        isAdmin: false,
        isEditor: true,
      },
    });

    payload.logger.info('  ✔ Users seeded');
  } else {
    payload.logger.info('  ⏭ Users already exist, skipping');
  }

  // ── 2. Media (placeholder images) ─────────────────────────────────────────
  // Media requires actual file uploads via Cloudinary; we create minimal
  // placeholder records so relationship fields can reference them.
  let mediaIds: string[] = [];
  const existingMedia = await payload.count({ collection: 'media' });
  if (existingMedia.totalDocs === 0) {
    const mediaSections = [
      { alt: 'Gallery placeholder 1', section: 'Gallery' },
      { alt: 'Gallery placeholder 2', section: 'Gallery' },
      { alt: 'News placeholder', section: 'News' },
      { alt: 'Project placeholder', section: 'Projects' },
      { alt: 'Team placeholder', section: 'Team' },
      { alt: 'Partner logo placeholder', section: 'Partners' },
      { alt: 'Sponsor logo placeholder', section: 'Sponsors' },
    ];

    for (const media of mediaSections) {
      const doc = await payload.create({
        collection: 'media',
        data: {
          alt: media.alt,
          section: media.section,
        },
        filePath: path.resolve(__dirname, '../public/images/logos/logo.webp'),
      });
      mediaIds.push(doc.id);
    }

    payload.logger.info('  ✔ Media seeded');
  } else {
    const existingMediaDocs = await payload.find({
      collection: 'media',
      limit: 7,
      sort: 'createdAt',
    });
    mediaIds = existingMediaDocs.docs.map((d) => d.id);
    payload.logger.info('  ⏭ Media already exist, using existing IDs');
  }

  // Helper to pick a media ID (cycles through available ones)
  const mediaId = (index: number) => mediaIds[index % mediaIds.length];

  // ── 3. Curators ───────────────────────────────────────────────────────────
  let curatorIds: string[] = [];
  const existingCurators = await payload.count({ collection: 'curators' });
  if (existingCurators.totalDocs === 0) {
    const curators = [
      {
        name: 'Maria Silva',
        slug: 'maria-silva',
        location: 'Lisboa, Portugal',
        image: mediaId(0),
        description: richText('Maria Silva é uma artista visual portuguesa.'),
      },
      {
        name: 'João Santos',
        slug: 'joao-santos',
        location: 'Porto, Portugal',
        image: mediaId(1),
        description: richText('João Santos é um curador de arte contemporânea.'),
      },
    ];

    for (const curator of curators) {
      const doc = await payload.create({
        collection: 'curators',
        data: curator,
        locale: 'pt',
      });
      curatorIds.push(doc.id);

      // Add English locale
      await payload.update({
        collection: 'curators',
        id: doc.id,
        locale: 'en',
        data: {
          description: richText(`${curator.name} is a Portuguese visual artist and curator.`),
        },
      });
    }

    payload.logger.info('  ✔ Curators seeded');
  } else {
    const existing = await payload.find({ collection: 'curators', limit: 2 });
    curatorIds = existing.docs.map((d) => d.id);
    payload.logger.info('  ⏭ Curators already exist, skipping');
  }

  // ── 4. Artworks ───────────────────────────────────────────────────────────
  const existingArtworks = await payload.count({ collection: 'artworks' });
  if (existingArtworks.totalDocs === 0 && curatorIds.length > 0) {
    const artworks = [
      {
        title: 'Horizonte Azul',
        slug: 'horizonte-azul',
        artist: curatorIds[0],
        image: mediaId(0),
        is_sold: false,
        year: 2024,
        price: '€450',
        dimensions: '60x80 cm',
        synopsis: richText('Uma obra que explora a vastidão do oceano Atlântico.'),
      },
      {
        title: 'Reflexos Urbanos',
        slug: 'reflexos-urbanos',
        artist: curatorIds[1] || curatorIds[0],
        image: mediaId(1),
        is_sold: true,
        year: 2023,
        price: '€320',
        dimensions: '40x50 cm',
        synopsis: richText('Reflexos da vida urbana contemporânea em Portugal.'),
      },
    ];

    for (const artwork of artworks) {
      const doc = await payload.create({
        collection: 'artworks',
        data: artwork,
        locale: 'pt',
      });

      await payload.update({
        collection: 'artworks',
        id: doc.id,
        locale: 'en',
        data: {
          title: artwork.title,
          price: artwork.price,
          synopsis: richText(`English description for "${artwork.title}".`),
        },
      });
    }

    payload.logger.info('  ✔ Artworks seeded');
  } else {
    payload.logger.info('  ⏭ Artworks already exist, skipping');
  }

  // ── 5. Board Members ──────────────────────────────────────────────────────
  const existingBoard = await payload.count({ collection: 'board-members' });
  if (existingBoard.totalDocs === 0) {
    const boardMembers = [
      {
        name: 'Ana Ferreira',
        section: 'board' as const,
        title: 'president' as const,
        position: 1,
        photo: mediaId(4),
        links: [{ platform: 'linkedin' as const, url: 'https://linkedin.com/in/ana-ferreira' }],
      },
      {
        name: 'Pedro Costa',
        section: 'board' as const,
        title: 'vice_president' as const,
        position: 2,
        photo: mediaId(4),
        links: [{ platform: 'linkedin' as const, url: 'https://linkedin.com/in/pedro-costa' }],
      },
      {
        name: 'Sofia Mendes',
        section: 'board' as const,
        title: 'treasurer' as const,
        position: 3,
        photo: mediaId(4),
      },
      {
        name: 'Ricardo Almeida',
        section: 'fiscal' as const,
        title: 'president' as const,
        position: 1,
      },
      {
        name: 'Catarina Oliveira',
        section: 'geral' as const,
        title: 'president' as const,
        position: 1,
      },
      {
        name: 'Miguel Tavares',
        section: 'advisory' as const,
        title: 'advisory_member' as const,
        position: 1,
      },
      {
        name: 'Tiago Rocha',
        section: 'gaming' as const,
        title: 'gaming_coordinator' as const,
        position: 1,
      },
    ];

    for (const member of boardMembers) {
      await payload.create({ collection: 'board-members', data: member });
    }

    payload.logger.info('  ✔ Board Members seeded');
  } else {
    payload.logger.info('  ⏭ Board Members already exist, skipping');
  }

  // ── 6. Partners ───────────────────────────────────────────────────────────
  const existingPartners = await payload.count({ collection: 'partners' });
  if (existingPartners.totalDocs === 0) {
    const partners = [
      {
        name: 'Associação Juvenil de Deão',
        country: 'Portugal',
        type: 'national' as const,
        logo: mediaId(5),
        links: [{ platform: 'website' as const, url: 'https://example.pt' }],
      },
      {
        name: 'Youth for Europe',
        country: 'Germany',
        type: 'international' as const,
        logo: mediaId(5),
        links: [{ platform: 'website' as const, url: 'https://example.de' }],
      },
      {
        name: 'Asociación Intercultural',
        country: 'Spain',
        type: 'international' as const,
        logo: mediaId(5),
      },
    ];

    for (const partner of partners) {
      await payload.create({ collection: 'partners', data: partner });
    }

    payload.logger.info('  ✔ Partners seeded');
  } else {
    payload.logger.info('  ⏭ Partners already exist, skipping');
  }

  // ── 7. Sponsors ───────────────────────────────────────────────────────────
  const existingSponsors = await payload.count({ collection: 'sponsors' });
  if (existingSponsors.totalDocs === 0) {
    const sponsors = [
      {
        name: 'TechCorp Portugal',
        logo: mediaId(6),
        website: 'https://techcorp.example.pt',
        tier: 'gold' as const,
      },
      {
        name: 'Creative Studio',
        logo: mediaId(6),
        website: 'https://creativestudio.example.pt',
        tier: 'silver' as const,
      },
      {
        name: 'Local Business',
        logo: mediaId(6),
        tier: 'bronze' as const,
      },
    ];

    for (const sponsor of sponsors) {
      await payload.create({ collection: 'sponsors', data: sponsor });
    }

    payload.logger.info('  ✔ Sponsors seeded');
  } else {
    payload.logger.info('  ⏭ Sponsors already exist, skipping');
  }

  // ── 8. Contributions ──────────────────────────────────────────────────────
  const existingContributions = await payload.count({ collection: 'contributions' });
  if (existingContributions.totalDocs === 0) {
    const contributions = [
      {
        donor: 'Maria Joaquina',
        is_confirmed: true,
        is_anonymous: false,
        value: 300,
        contribution_date: '2025-03-15T00:00:00.000Z',
        contribution_type: 'OFFICE_CHAIR' as const,
        extra_info: 'Cadeira doada em nome da família.',
      },
      {
        donor: 'Anonymous Donor',
        is_confirmed: true,
        is_anonymous: true,
        value: 50,
        contribution_date: '2025-06-01T00:00:00.000Z',
        contribution_type: 'BANK' as const,
      },
      {
        donor: 'Empresa XYZ',
        is_confirmed: false,
        is_anonymous: false,
        value: 1800,
        contribution_date: '2025-09-20T00:00:00.000Z',
        contribution_type: 'WALL_NAME_COMPANY' as const,
        extra_info: 'Aguardando confirmação de pagamento.',
      },
      {
        donor: 'Pedro Alves',
        is_confirmed: true,
        is_anonymous: false,
        value: 230,
        contribution_date: '2025-11-10T00:00:00.000Z',
        contribution_type: 'AUDITORIUM_CHAIR' as const,
      },
    ];

    for (const contribution of contributions) {
      await payload.create({ collection: 'contributions', data: contribution });
    }

    payload.logger.info('  ✔ Contributions seeded');
  } else {
    payload.logger.info('  ⏭ Contributions already exist, skipping');
  }

  // ── 9. Hawk Projects ──────────────────────────────────────────────────────
  const existingProjects = await payload.count({ collection: 'hawk_projects' });
  if (existingProjects.totalDocs === 0) {
    const projects = [
      {
        heading: 'Erasmus+ Youth Exchange 2025',
        subheading: 'Intercâmbio juvenil em Viana do Castelo',
        description: 'Um programa de intercâmbio juvenil focado em cidadania ativa e inclusão.',
        slug: 'erasmus-youth-exchange-2025',
        type_event: 'erasmus' as const,
        image: {
          imageType: 'upload' as const,
          upload: mediaId(3),
          alt: 'Erasmus Youth Exchange',
        },
        page_content: richText(
          'O programa Erasmus+ Youth Exchange 2025 reúne jovens de 6 países europeus.'
        ),
      },
      {
        heading: 'Festival Cultural HawkStars',
        subheading: 'O maior evento cultural da região',
        description: 'Festival anual com música, arte e gastronomia.',
        slug: 'festival-cultural-hawkstars',
        type_event: 'local_event' as const,
        image: {
          imageType: 'upload' as const,
          upload: mediaId(3),
          alt: 'Festival Cultural',
        },
        page_content: richText('O Festival Cultural HawkStars acontece anualmente em setembro.'),
      },
      {
        heading: 'International Conference on Youth Work',
        subheading: 'Building bridges across borders',
        description: 'Conferência internacional sobre trabalho juvenil.',
        slug: 'international-conference-youth-work',
        type_event: 'international_event' as const,
        image: {
          imageType: 'upload' as const,
          upload: mediaId(3),
          alt: 'International Conference',
        },
      },
    ];

    for (const project of projects) {
      const doc = await payload.create({
        collection: 'hawk_projects',
        data: project,
        locale: 'pt',
      });

      await payload.update({
        collection: 'hawk_projects',
        id: doc.id,
        locale: 'en',
        data: {
          heading: project.heading,
          subheading: project.subheading ? `${project.subheading} (EN)` : undefined,
          description: project.description ? `${project.description} (English version)` : undefined,
        },
      });
    }

    payload.logger.info('  ✔ Hawk Projects seeded');
  } else {
    payload.logger.info('  ⏭ Hawk Projects already exist, skipping');
  }

  // ── 10. News ──────────────────────────────────────────────────────────────
  const existingNews = await payload.count({ collection: 'news' });
  if (existingNews.totalDocs === 0) {
    const newsArticles = [
      {
        title: 'HawkStars lança novo programa de voluntariado',
        slug: 'novo-programa-voluntariado',
        type: 'news' as const,
        status: 'published' as const,
        publishedAt: '2025-10-01T10:00:00.000Z',
        content: richText(
          'A HawkStars anuncia o lançamento de um novo programa de voluntariado destinado a jovens entre os 18 e 30 anos.'
        ),
        mainImage: {
          imageType: 'upload' as const,
          upload: mediaId(2),
          alt: 'Programa de Voluntariado',
        },
      },
      {
        title: 'Resultados do Festival Cultural 2025',
        slug: 'resultados-festival-cultural-2025',
        type: 'blog' as const,
        status: 'published' as const,
        publishedAt: '2025-09-20T14:00:00.000Z',
        content: richText(
          'O Festival Cultural 2025 foi um sucesso com mais de 500 participantes de toda a região.'
        ),
        mainImage: {
          imageType: 'upload' as const,
          upload: mediaId(2),
          alt: 'Festival Cultural 2025',
        },
      },
      {
        title: 'Nova parceria com associação europeia',
        slug: 'nova-parceria-europeia',
        type: 'press_release' as const,
        status: 'draft' as const,
        content: richText('A HawkStars firmou uma nova parceria estratégica no âmbito Erasmus+.'),
        mainImage: {
          imageType: 'upload' as const,
          upload: mediaId(2),
          alt: 'Parceria Europeia',
        },
      },
    ];

    for (const article of newsArticles) {
      const doc = await payload.create({
        collection: 'news',
        data: article,
        locale: 'pt',
      });

      await payload.update({
        collection: 'news',
        id: doc.id,
        locale: 'en',
        data: {
          title: `${article.title} (EN)`,
          content: richText(`English version of: ${article.title}`),
        },
      });
    }

    payload.logger.info('  ✔ News seeded');
  } else {
    payload.logger.info('  ⏭ News already exist, skipping');
  }

  // ── 11. Pages ─────────────────────────────────────────────────────────────
  const existingPages = await payload.count({ collection: 'pages' });
  if (existingPages.totalDocs === 0) {
    const pages = [
      {
        title: 'Sobre Nós',
        slug: 'about',
        status: 'published' as const,
        publishedAt: '2025-01-01T00:00:00.000Z',
        layout: richText(
          'A HawkStars é uma associação cultural sem fins lucrativos dedicada ao desenvolvimento cultural e juvenil.'
        ),
      },
      {
        title: 'Contacto',
        slug: 'contact',
        status: 'published' as const,
        publishedAt: '2025-01-01T00:00:00.000Z',
        layout: richText(
          'Entre em contacto connosco através do formulário abaixo ou dos nossos canais de comunicação.'
        ),
      },
      {
        title: 'Galeria',
        slug: 'gallery',
        status: 'draft' as const,
        layout: richText('A nossa galeria de arte apresenta obras de artistas portugueses.'),
      },
    ];

    for (const page of pages) {
      const doc = await payload.create({
        collection: 'pages',
        data: page,
        locale: 'pt',
      });

      await payload.update({
        collection: 'pages',
        id: doc.id,
        locale: 'en',
        data: {
          title:
            page.title === 'Sobre Nós'
              ? 'About Us'
              : page.title === 'Contacto'
                ? 'Contact'
                : 'Gallery',
          layout: richText(`English version of the "${page.title}" page.`),
        },
      });
    }

    payload.logger.info('  ✔ Pages seeded');
  } else {
    payload.logger.info('  ⏭ Pages already exist, skipping');
  }

  // ── 12. Notifications ─────────────────────────────────────────────────────
  const existingNotifications = await payload.count({ collection: 'notifications' });
  if (existingNotifications.totalDocs === 0) {
    const notifications = [
      {
        title: 'Seed data created',
        message: 'All collections were populated with sample data.',
        situation: 'create' as const,
        read: false,
      },
      {
        title: 'Welcome to HawkStars CMS',
        message: 'The admin panel is ready. Start managing your content!',
        situation: 'message' as const,
        read: false,
      },
    ];

    for (const notification of notifications) {
      await payload.create({ collection: 'notifications', data: notification });
    }

    payload.logger.info('  ✔ Notifications seeded');
  } else {
    payload.logger.info('  ⏭ Notifications already exist, skipping');
  }

  payload.logger.info('🌱 Seed complete!');
}

// ── Helper ────────────────────────────────────────────────────────────────────

/** Build a minimal Lexical rich-text JSON structure from a plain string. */
function richText(text: string) {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'paragraph' as const,
          children: [{ type: 'text' as const, text, version: 1 }],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  };
}

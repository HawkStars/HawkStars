import { getPayload, Payload } from 'payload';

export const seed = async (payload: Payload): Promise<void> => {
  try {
    // Seed Header
    const headerDoc = await payload.findGlobal({
      slug: 'header',
    });

    if (!headerDoc) {
      await payload.updateGlobal({
        slug: 'header',
        data: {
          columns: [
            {
              id: 'test',
              data: {
                key: 'main',
                links: [
                  { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
                ],
              },
            },
            {
              id: 'test',
              data: {
                key: 'main',
                links: [
                  { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
                ],
              },
            },
            {
              id: 'test',
              data: {
                key: 'main',
                links: [
                  { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
                ],
              },
            },
            {
              id: 'test',
              data: {
                key: 'main',
                links: [
                  { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
                ],
              },
            },
            {
              id: 'test',
              data: {
                key: 'main',
                links: [
                  { link: { appearance: 'default', label: 'Test 1', type: 'custom', url: '/' } },
                ],
              },
            },
          ],
        },
      });
      console.log('✅ Header seeded successfully');
    }

    // Seed Footer
    const footerDoc = await payload.findGlobal({
      slug: 'footer',
    });

    if (!footerDoc) {
      await payload.updateGlobal({
        slug: 'footer',
        data: {
          columns: {
            pt: '© 2024 HawkStars. Todos os direitos reservados.',
            en: '© 2024 HawkStars. All rights reserved.',
          },
          socialLinks: [
            {
              platform: 'facebook',
              url: 'https://facebook.com/hawkstars',
            },
            {
              platform: 'instagram',
              url: 'https://instagram.com/hawkstars',
            },
            {
              platform: 'twitter',
              url: 'https://twitter.com/hawkstars',
            },
          ],
          contactInfo: {
            email: 'info@hawkstars.org',
            phone: '+351 123 456 789',
            address: {
              pt: 'Rua da Arte, 123\n1000-001 Lisboa',
              en: 'Art Street, 123\n1000-001 Lisbon',
            },
          },
        },
      });
      console.log('✅ Footer seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error creating demo page:', error);
  }
};

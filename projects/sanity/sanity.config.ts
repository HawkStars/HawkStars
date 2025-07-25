import { defineArrayMember, defineConfig, Preview } from 'sanity';
import { structureTool } from 'sanity/structure';
import { cloudinarySchemaPlugin } from 'sanity-plugin-cloudinary';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works

import { schema } from './types/schema';
import { dataset, projectId } from './env';
import { BlockComponent } from './components/items/BoardMemberItem';
import { SanityHawkLogo } from './components/logo';

export default defineConfig({
  basePath: '/',
  projectId,
  dataset,
  icon: SanityHawkLogo,
  name: 'HawkStars',
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  studio: {
    components: {},
  },
  plugins: [
    structureTool({
      name: 'models',
      title: 'Modelos',
      defaultDocumentNode: (S) =>
        S.document().views([S.view.form(), S.view.component(Preview).title('Preview')]),
    }),
    // presentationTool({
    //   previewUrl: {
    //     origin: 'https://hawkstars.org',
    //   },
    // }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    // visionTool({ defaultApiVersion: apiVersion }),
    // cloudinary cdn schema
    cloudinarySchemaPlugin(),
    internationalizedArray({
      languages: [
        { id: 'en', title: 'English' },
        { id: 'pt', title: 'Portuguese' },
        { id: 'fr', title: 'French' },
      ],
      defaultLanguages: ['pt'],
      fieldTypes: [
        'string',
        {
          name: 'formattedText',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'block',
              of: [
                {
                  type: 'accordion',
                  title: 'Accordion',
                },
                {
                  type: 'cloudinary.asset',
                  title: 'Cloudinary Image',
                },
                { type: 'hero', title: 'Hero Banner' },
                { type: 'slider', title: 'Slider' },
                { type: 'reference', to: [{ type: 'board_member' }] },
              ],
            }),
            { type: 'youtube', title: 'YouTube Video' },
          ],
        },
      ],
    }),
  ],
});

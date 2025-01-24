import { visionTool } from '@sanity/vision';
import { defineConfig, Preview } from 'sanity';
import { structureTool } from 'sanity/structure';
import { cloudinarySchemaPlugin } from 'sanity-plugin-cloudinary';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './sanity/env';
import { schema } from './sanity/schema';

export default defineConfig({
  basePath: '/',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins: [
    structureTool({
      name: 'models',
      title: 'Modelos',
      defaultDocumentNode: (S) =>
        S.document().views([S.view.form(), S.view.component(Preview).title('Preview')]),
    }),

    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
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
          of: [{ type: 'block' }],
        },
      ],
    }),
  ],
});

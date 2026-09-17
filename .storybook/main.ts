// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../payload/blocks/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    'msw-storybook-addon',
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  typescript: {
    reactDocgen: 'react-docgen',
  },
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../'),
      };
    }

    // Pre-bundle deps that only appear deep in a story's import graph.
    //
    // Vite's dependency optimizer scans entry points up front. A bare import it
    // has not seen is discovered mid-run, which triggers a re-optimization and
    // changes the browser hash on every optimized module URL (`?v=...`). In the
    // dev server that is a page reload; under `vitest --browser` it invalidates
    // modules that are already in flight, and the run fails en masse with
    // "Failed to fetch dynamically imported module" plus a second copy of vitest
    // ("Vitest failed to find the current suite") — in files that have nothing
    // to do with the dependency that caused it.
    //
    // `react-day-picker/locale` is reached only from components/ui/calendar.tsx,
    // via Calendar.stories.tsx and DatePicker.stories.tsx. Add an entry here
    // whenever a story graph gains a new bare import from a subpath like this.
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include ?? []),
        'react-day-picker',
        'react-day-picker/locale',
      ],
    };

    return config;
  },
  features: {
    experimentalRSC: true,
  },
};
export default config;

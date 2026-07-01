---
paths:
  - '**/*.stories.tsx'
  - '.storybook/**'
  - 'stories/**'
---

# Storybook Guidelines

## Stack

- **Storybook 10** with `@storybook/nextjs-vite` framework (Vite-based builder for Next.js).
- **Addons**: `@chromatic-com/storybook` (visual regression via Chromatic), `@storybook/addon-vitest`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-onboarding`, `@storybook/addon-styling-webpack`.
- **MSW**: `msw-storybook-addon` is initialized in `preview.ts` for API mocking. Use `mswLoader` for stories that need network mocks.
- **Visual Regression**: Chromatic runs against the built Storybook. All stories are captured as snapshots automatically.

## Commands

```bash
pnpm storybook          # Dev server on port 6006
pnpm build-storybook    # Static build (used by Chromatic CI)
```

## Story File Location

Stories live in two places depending on the component type:

| Component type                  | Story location                                                                   | Example                                        |
| ------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------- |
| Payload block                   | Co-located in the block folder: `payload/blocks/BlockName/BlockName.stories.tsx` | `payload/blocks/FAQBlock/FAQBlock.stories.tsx` |
| UI / utility / layout component | In the `stories/` folder, mirroring the component hierarchy                      | `stories/utils/Button.stories.tsx`             |
| Navigation components           | `stories/navbar/` or `stories/footer/`                                           | `stories/navbar/Navbar.stories.tsx`            |

For Payload blocks, the story file is one of the three mandatory files in every block folder (alongside `config.ts` and `Component.tsx`). Some blocks use `Component.stories.tsx` instead of `BlockName.stories.tsx` — both are acceptable, but prefer `BlockName.stories.tsx` for new blocks.

## Story Structure

All stories use the CSF3 format with `@storybook/nextjs-vite` types.

### Block stories (typical pattern)

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FAQBlock } from './Component';

const meta: Meta<typeof FAQBlock> = {
  title: 'Extra/FAQBlock',
  component: FAQBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FAQBlock>;

export const Default: Story = {
  args: {
    title: 'Frequently Asked Questions',
    items: [
      /* … */
    ],
    id: '1',
    blockName: 'FAQBlock',
    blockType: 'faq',
  },
};
```

### UI component stories (typical pattern)

```tsx
import { Button } from '@/components/ui/button';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Utils/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Button' },
};
```

## Key Conventions

### Imports

- Always import types from `@storybook/nextjs-vite`, **not** from `@storybook/react`.
- Use `Meta<typeof Component>` and `StoryObj<typeof Component>` (or `StoryObj<typeof meta>` when using `satisfies`).

### Meta configuration

- **`title`**: Use the `Category/ComponentName` hierarchy (see Title Hierarchy below).
- **`component`**: Always set to the rendered component.
- **`parameters.layout`**: Use `'fullscreen'` for blocks and page-level components; `'centered'` for small UI primitives.
- **`tags: ['autodocs']`**: Add for UI primitives and utility components to auto-generate docs pages. Omit for block stories.
- **`argTypes`**: Define `control` type for props with a fixed set of values (selects, booleans). Use `control: 'select'` for enum-like props.

### Story naming

- Always export a `Default` story showing the component in its most common configuration.
- Name additional stories after the variant or state they demonstrate: `WithSubtitle`, `ImageLeft`, `NoFeatures`, `AutoplayMuted`, `Disabled`, etc.
- Use PascalCase for story export names.

### Args for Payload blocks

Block stories must include the Payload block metadata fields alongside the content props:

```tsx
args: {
  // content props
  title: 'Example',
  items: [ /* … */ ],
  // block metadata (required by the generated types)
  id: '1',
  blockName: 'BlockName',
  blockType: 'blockSlug',
},
```

the fields id, blockName and blockType are optional but nice to have in the actual block component.
On the blocks the other types are required to have all the time. It will help the content team to understand where each of the fields matches visually in the CMS and it will also help us to have a more consistent data structure across all the blocks.

### Reusing args across stories

Spread from `Default.args` when creating variations:

```tsx
export const WithHeaderImage: Story = {
  args: {
    ...Default.args,
    headerImage: {
      /* override */
    },
  },
};
```

## Title Hierarchy

Stories are organized into categories via the `title` field in `meta`. Use these established categories:

| Category          | Used for                       | Example titles                                                      |
| ----------------- | ------------------------------ | ------------------------------------------------------------------- |
| `Hero/`           | Hero block variants            | `Hero/Simple`, `Hero/HeroSlideshow`, `Hero/HeroWithBackgroundImage` |
| `Section/`        | Content section blocks         | `Section/Content With Image`, `Section/CampaignCountdownBlock`      |
| `Content/`        | Data display blocks            | `Content/SectionTitleBlock`, `Content/DataGridBlock`                |
| `Cards/`          | Card-based blocks              | `Cards/SocialProofBlock`                                            |
| `Media/`          | Image, video, logo blocks      | `Media/Image Block`, `Media/VideoBlock`, `Media/Logos`              |
| `Maps/`           | Map blocks                     | `Maps/MapLocationBlock`                                             |
| `Call To Action/` | CTA blocks                     | `Call To Action/Globe`                                              |
| `News & Events/`  | News, events, agenda blocks    | `News & Events/Latest News`, `News & Events/AgendaBlock`            |
| `Organization/`   | Sponsors, team blocks          | `Organization/Sponsors`                                             |
| `Extra/`          | Miscellaneous blocks           | `Extra/FAQBlock`, `Extra/DonationProgressBlock`                     |
| `Blocks/`         | Generic blocks                 | `Blocks/BentoGrid`                                                  |
| `Utils/`          | UI primitives and utilities    | `Utils/Button`, `Utils/Spinner`, `Utils/Typography`, `Utils/Colors` |
| `Header/`         | Navbar and dropdown components | `Header/Navbar`, `Header/DropdownV1`                                |
| `Navigation/`     | Footer                         | `Navigation/Footer`                                                 |

When adding a new block, pick the most fitting existing category. Only create a new category if nothing fits.

## Storybook Helpers (`utils/storybook.ts`)

Use these helpers to create mock Payload data in stories:

```tsx
import { createPayloadExternalImage, createPayloadLink } from '@/utils/storybook';

// External image mock (for ImageType fields)
createPayloadExternalImage('external', 'https://images.unsplash.com/photo-…', 'Alt text');

// Link mock (for LinkField data)
createPayloadLink('custom', '/get-started', false, 'Get Started');
```

Use these instead of manually constructing Payload data shapes. Add new helpers to `utils/storybook.ts` when a new reusable Payload data shape appears frequently across stories.

## Rich Text in Stories

For blocks with Lexical rich text fields (`DefaultTypedEditorState`), construct the editor state object manually in the story:

```tsx
import { sampleRichTextWithDescription } from 'utils/storybook';

// In args:
description: sampleRichTextWithDescription as DefaultTypedEditorState,
```

## Preview Configuration

Global Storybook configuration lives in `.storybook/preview.ts`:

- **Global CSS**: `app/globals.css` is imported so all Tailwind utilities and custom theme variables are available.
- **Background options**: `light` (`#ffffff`) and `dark` (`#1a1a1a`) backgrounds are configured. Default is `light`.
- **MSW**: Mock Service Worker is initialized globally via `mswLoader` for all stories that need API mocking.
- **Control matchers**: Color controls for `*background*` / `*color*` props, date controls for `*Date*` props.

## Path Aliases

The `@/` alias is configured in `.storybook/main.ts` via `viteFinal` to resolve to the project root, matching `tsconfig.json`. Always use `@/` imports in stories.

## Static Assets

The `public/` directory is served as static files via `staticDirs` in `.storybook/main.ts`. Images and other public assets are accessible at their normal paths (e.g., `/images/logo.svg`).

## Checklist for New Stories

1. Create the story file in the correct location (co-located for blocks, `stories/` for UI components).
2. Import types from `@storybook/nextjs-vite`.
3. Set an appropriate `title` using the established category hierarchy.
4. Set `parameters.layout` to `'fullscreen'` or `'centered'` as appropriate.
5. Export a `Default` story with realistic mock data.
6. Add variant stories covering key visual states and edge cases (empty data, long text, missing optional props).
7. For Payload blocks, include `id`, `blockName`, and `blockType` in args.
8. Use helpers from `utils/storybook.ts` for Payload data shapes.
9. Verify the story renders in `pnpm storybook` before committing.

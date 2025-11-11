# Payload CMS Guide for HawkStars

## What is Payload CMS?

Payload CMS is a modern, headless Content Management System (CMS) built with TypeScript and React. In the HawkStars project, Payload serves as the **backend content management system** that powers all dynamic content on the website.

### Key Characteristics

- **Headless CMS**: Payload provides APIs to access content but doesn't dictate how the frontend is built
- **Self-hosted**: Runs alongside your Next.js application, not as a separate service
- **Type-safe**: Generates TypeScript types automatically from your content schemas
- **MongoDB-backed**: All content is stored in a MongoDB database
- **Multilingual**: Built-in support for Portuguese (pt) and English (en) content

## What Payload Represents in This Project

Payload CMS is the **source of truth** for all content on the HawkStars website, including:

- 🎨 **Art Collections** (artworks)
- 📄 **Dynamic Pages** (custom pages with flexible layouts)
- 👥 **Team Members** (board members, curators)
- 📅 **Events** (HawkStars events)
- 🤝 **Partners** (organization partners)
- 💰 **Contributions** (financial contributions)
- 📸 **Media Assets** (images stored in Cloudinary)
- 🧭 **Navigation** (header and footer menus)

The only exceptions are static UI translations, which are stored in YAML files in `i18n/locales/`.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js 15 App                        │
│  ┌────────────────┐              ┌───────────────────────┐  │
│  │  Frontend      │              │  Payload Admin Panel   │  │
│  │  (App Router)  │◄────────────►│  /admin/*              │  │
│  │  /[lng]/*      │   API Calls  │  (payload)/admin/*     │  │
│  └────────────────┘              └───────────────────────┘  │
│         │                                    │               │
│         │                                    │               │
│         ▼                                    ▼               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Payload CMS Core                         │   │
│  │  - Collections (Content Types)                        │   │
│  │  - Globals (Site-wide Settings)                       │   │
│  │  - Blocks (Reusable Components)                       │   │
│  │  - Access Control                                     │   │
│  │  - Hooks (Lifecycle Events)                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │   MongoDB Database     │
              │   (Content Storage)    │
              └────────────────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Cloudinary CDN        │
              │  (Media Storage)       │
              └────────────────────────┘
```

## Core Concepts

### 1. Collections

Collections are **content types** that define the structure of your data. Each collection represents a specific type of content.

#### Available Collections

| Collection        | Slug            | Purpose                            | Admin Access | Public Read |
| ----------------- | --------------- | ---------------------------------- | ------------ | ----------- |
| **ArtCollection** | `artworks`      | Art pieces in the gallery          | ✓            | ✓           |
| **Pages**         | `pages`         | Custom pages with flexible layouts | ✓            | ✓           |
| **HawkEvent**     | `hawk-events`   | Organization events                | ✓            | ✓           |
| **Contribution**  | `contributions` | Financial contributions            | ✓            | ✓           |
| **BoardMember**   | `board-members` | Board member profiles              | ✓            | ✓           |
| **Curator**       | `curators`      | Curator profiles                   | ✓            | ✓           |
| **Partner**       | `partners`      | Organization partners              | ✓            | ✓           |
| **Media**         | `media`         | Images and media files             | ✓            | ✓           |
| **Users**         | `users`         | Admin users                        | ✓            | Admin only  |

#### Collection Example: ArtCollection

```typescript
export const ArtCollection: CollectionConfig = {
  slug: 'artworks',
  access: {
    admin: authenticated, // Only authenticated users can access admin
    read: anyone, // Anyone can read/view artworks
    create: authenticated, // Only authenticated users can create
    delete: authenticated, // Only authenticated users can delete
    update: authenticated, // Only authenticated users can update
  },
  labels: {
    singular: 'Artwork',
    plural: 'Artworks',
  },
  admin: {
    useAsTitle: 'title', // Use 'title' field as document identifier
    defaultColumns: ['title', 'artist', 'year', 'is_sold'],
  },
  fields: [
    // Field definitions go here
  ],
};
```

### 2. Globals

Globals are **site-wide settings** that exist as a single instance (not multiple documents like collections).

#### Available Globals

| Global       | Purpose                   | Example Data                   |
| ------------ | ------------------------- | ------------------------------ |
| **Header**   | Navigation menu structure | Links, dropdown menus          |
| **Footer**   | Footer content and links  | Social links, legal links      |
| **MainPage** | Homepage specific content | Hero section, featured content |

#### Global Example: Header

```typescript
export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone, // Anyone can read header data
  },
  fields: [
    {
      name: 'Navigation Columns',
      type: 'array',
      fields: [HeaderNavGroup], // Navigation items
    },
  ],
};
```

### 3. Blocks

Blocks are **reusable content components** that can be used within rich text editors or page layouts. They allow content editors to build flexible page layouts.

#### Available Blocks

| Block                | Purpose                 | Use Case                            |
| -------------------- | ----------------------- | ----------------------------------- |
| **Hero**             | Large header section    | Page headers with background images |
| **CallToAction**     | Action-oriented section | "Join Us", "Donate" buttons         |
| **ContentWithImage** | Text + Image layout     | About sections, feature highlights  |
| **GallerySlider**    | Image carousel          | Artwork galleries, photo slideshows |
| **MediaBlock**       | Single media display    | Embedded images or videos           |

#### Block Example: Hero

```typescript
export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      defaultValue: 50,
      min: 0,
      max: 100,
    },
    linkGroup({
      // Link buttons
      appearances: ['default', 'outline'],
      overrides: { maxRows: 2 },
    }),
  ],
};
```

### 4. Access Control

Payload uses a role-based access control system:

- **`authenticated`**: Only logged-in admin users
- **`anyone`**: Public access (no authentication required)
- **`authenticatedAdmin`**: Admin-level users only
- **`authenticatedEditor`**: Editor-level users only

These access functions are defined in `payload/access/` directory.

### 5. Localization

All collections and globals support **multilingual content** (Portuguese and English):

```typescript
localization: {
  defaultLocale: 'pt',
  locales: [
    { label: 'English', code: 'en', fallbackLocale: 'pt' },
    { label: 'Portuguese', code: 'pt' },
  ],
  fallback: true,
}
```

Content editors can provide translations for each language, and the system will automatically fall back to Portuguese if English content is missing.

## File Structure

```
payload/
├── access/                 # Access control functions
│   ├── anyone.ts          # Public access
│   ├── authenticated.ts   # Requires login
│   ├── authenticatedAdmin.ts
│   └── authenticatedEditor.ts
│
├── blocks/                # Reusable content blocks
│   ├── CallToAction/
│   │   ├── config.ts     # Block schema
│   │   └── Component.tsx # React component
│   ├── ContentWithImage/
│   ├── GallerySlider/
│   ├── Hero/
│   └── MediaBlock/
│
├── collections/           # Content type definitions
│   ├── ArtCollection/
│   ├── BoardMember.ts
│   ├── Contribution/
│   ├── Curator/
│   ├── HawkEvent/
│   ├── Media.ts
│   ├── Pages/
│   ├── Partner.ts
│   └── Users/
│
├── components/            # Custom admin UI components
│
├── fields/               # Reusable field definitions
│   ├── HeaderNavGroup.ts # Navigation group fields
│   ├── linkGroup.ts      # Link button fields
│   └── SocialLink/       # Social media links
│
├── globals/              # Site-wide settings
│   ├── Footer/
│   │   ├── config.ts
│   │   └── components/
│   ├── Header/
│   │   ├── config.ts
│   │   └── components/
│   └── MainPage/
│
├── hooks/                # Lifecycle event handlers
│   └── populatePublishedAt.ts
│
├── plugins/              # Payload plugins configuration
│   └── index.ts          # SEO, Cloud Storage
│
└── utilities/            # Helper functions
    ├── generatePreviewPath.ts
    └── getURL.ts
```

## Development Workflows

### Accessing the Admin Panel

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Navigate to the admin panel:

   ```
   http://localhost:3000/admin
   ```

3. Log in with your admin credentials

### Creating a New Collection

1. Create a new file in `payload/collections/`:

   ```typescript
   // payload/collections/NewCollection.ts
   import { CollectionConfig } from 'payload';
   import { authenticated } from '../access/authenticated';
   import { anyone } from '../access/anyone';

   export const NewCollection: CollectionConfig = {
     slug: 'new-collection',
     access: {
       admin: authenticated,
       read: anyone,
       create: authenticated,
       delete: authenticated,
       update: authenticated,
     },
     fields: [
       {
         name: 'title',
         type: 'text',
         required: true,
       },
       // Add more fields...
     ],
   };
   ```

2. Add to `payload.config.ts`:

   ```typescript
   import { NewCollection } from './payload/collections/NewCollection';

   export default buildConfig({
     collections: [
       Users,
       Media,
       NewCollection, // Add here
       // ...
     ],
   });
   ```

3. Generate TypeScript types:
   ```bash
   pnpm payload:generate
   ```

### Creating a New Block

1. Create block folder structure:

   ```
   payload/blocks/NewBlock/
   ├── config.ts       # Block schema
   └── Component.tsx   # React component
   ```

2. Define the block schema (`config.ts`):

   ```typescript
   import type { Block } from 'payload';

   export const NewBlock: Block = {
     slug: 'new-block',
     interfaceName: 'NewBlockType',
     fields: [
       {
         name: 'title',
         type: 'text',
         required: true,
       },
       // Add more fields...
     ],
     labels: {
       singular: 'New Block',
       plural: 'New Blocks',
     },
   };
   ```

3. Create the React component (`Component.tsx`):

   ```typescript
   import React from 'react';
   import { NewBlockType } from '@/payload-types';

   export const NewBlock: React.FC<NewBlockType> = ({ title }) => {
     return (
       <div>
         <h2>{title}</h2>
       </div>
     );
   };
   ```

4. Add block to collections that should use it:

   ```typescript
   // In payload.config.ts
   import { NewBlock } from './payload/blocks/NewBlock/config';

   editor: lexicalEditor({
     features: ({ defaultFeatures, rootFeatures }) => [
       ...defaultFeatures,
       BlocksFeature({
         blocks: [
           CallToAction,
           MediaBlock,
           NewBlock, // Add here
         ],
       }),
     ],
   }),
   ```

5. Update the import map:

   ```bash
   pnpm payload:generate -- --importMap
   ```

6. Regenerate types:
   ```bash
   pnpm payload:generate
   ```

### Modifying an Existing Collection

1. Edit the collection file in `payload/collections/`

2. Regenerate types:

   ```bash
   pnpm payload:generate
   ```

3. Restart the dev server if needed

### Working with Hooks

Hooks allow you to run code at specific points in the content lifecycle:

```typescript
export const Pages: CollectionConfig = {
  slug: 'pages',
  hooks: {
    beforeChange: [populatePublishedAt], // Before saving
    afterChange: [revalidatePage], // After saving
    afterDelete: [revalidateDelete], // After deleting
  },
  // ...
};
```

Common hooks:

- **`beforeChange`**: Modify data before saving
- **`afterChange`**: Trigger actions after saving (e.g., revalidate cache)
- **`afterDelete`**: Clean up after deletion
- **`beforeRead`**: Modify data before sending to client

## Common Patterns

### Fetching Data in Next.js

```typescript
import { getPayload } from 'payload';
import config from '@payload-config';

// In a Server Component
export default async function ArtworkPage({ params }) {
  const payload = await getPayload({ config });

  const artworks = await payload.find({
    collection: 'artworks',
    where: {
      is_sold: { equals: false }
    },
    limit: 10,
    locale: params.lng, // Use current language
  });

  return (
    <div>
      {artworks.docs.map(artwork => (
        <div key={artwork.id}>{artwork.title}</div>
      ))}
    </div>
  );
}
```

### Using Relationship Fields

Collections can reference each other:

```typescript
{
  name: 'artist',
  type: 'relationship',
  relationTo: 'curators', // References the 'curators' collection
  required: true,
}
```

### Rich Text with Blocks

The Pages collection uses Lexical editor with blocks for flexible layouts:

```typescript
{
  name: 'layout',
  type: 'richText',
  required: true,
  // Users can insert Hero, CallToAction, MediaBlock, etc.
}
```

### Upload Fields (Media)

Media files are uploaded to Cloudinary:

```typescript
{
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  required: true,
}
```

## Plugins

### SEO Plugin

Provides SEO fields for pages:

- Meta title
- Meta description
- Meta image
- Preview functionality

### Cloud Storage Plugin

Integrates with Cloudinary for media storage:

- Automatic upload to Cloudinary
- CDN delivery
- Image optimization
- Prevents local storage

## Custom Endpoints

Custom API endpoints can be added:

```typescript
endpoints: [
  {
    path: '/sum-contributions',
    method: 'get',
    handler: totalContributioValueQuery,
  },
];
```

Access at: `http://localhost:3000/api/sum-contributions`

## Type Safety

Payload generates TypeScript types in `payload-types.ts`:

```typescript
import { Page, ArtCollection, User } from '@/payload-types';

// Use these types in your components
const page: Page = await payload.findByID({
  collection: 'pages',
  id: '123',
});
```

## Best Practices

### 1. Always Regenerate Types

After making changes to collections, blocks, or globals:

```bash
pnpm payload:generate
```

### 2. Use Access Control

Always define appropriate access control:

- Public data: `read: anyone`
- Admin data: `read: authenticated`
- Never expose sensitive data publicly

### 3. Leverage Localization

Add localized content for multilingual support:

- Default: Portuguese (pt)
- Fallback: Always provide Portuguese content
- Optional: Add English translations

### 4. Use Hooks for Side Effects

Don't put business logic in collections; use hooks:

- Cache revalidation
- Data transformation
- External API calls
- Email notifications

### 5. Version Control

Pages collection has versioning enabled:

- Drafts with autosave
- Schedule publishing
- Version history (max 50 versions)

### 6. Use Tabs for Organization

Group related fields in tabs for better UX:

```typescript
{
  type: 'tabs',
  tabs: [
    {
      label: 'Content',
      fields: [/* content fields */],
    },
    {
      label: 'SEO',
      fields: [/* SEO fields */],
    },
  ],
}
```

## Troubleshooting

### Types Not Updating

```bash
# Force regenerate types
rm payload-types.ts
pnpm payload:generate
```

### Admin Panel Not Loading

1. Check MongoDB connection:

   ```bash
   # Verify DATABASE_URI in .env
   ```

2. Check Payload secret:

   ```bash
   # Verify PAYLOAD_SECRET in .env
   ```

3. Restart dev server:
   ```bash
   pnpm dev
   ```

### Media Upload Failing

1. Verify Cloudinary credentials:

   ```bash
   # Check .env for:
   # CLOUDINARY_CLOUD_NAME
   # CLOUDINARY_API_KEY
   # CLOUDINARY_API_SECRET
   ```

2. Check upload file size limits

### Collection Not Appearing

1. Ensure it's added to `payload.config.ts`
2. Regenerate types: `pnpm payload:generate`
3. Restart dev server

## Resources

- **Payload Documentation**: https://payloadcms.com/docs
- **Project Config**: `payload.config.ts`
- **Repository Instructions**: `.github/copilot-instructions.md`
- **Type Definitions**: `payload-types.ts` (auto-generated)

## Summary

Payload CMS in HawkStars is the **content management backbone** that:

1. ✅ Stores all dynamic content in MongoDB
2. ✅ Provides a user-friendly admin interface at `/admin`
3. ✅ Supports multilingual content (Portuguese/English)
4. ✅ Integrates with Cloudinary for media storage
5. ✅ Generates TypeScript types for type safety
6. ✅ Offers flexible page layouts with blocks
7. ✅ Handles access control and permissions
8. ✅ Provides SEO optimization features
9. ✅ Supports versioning and scheduled publishing
10. ✅ Extends easily with hooks and custom endpoints

By using Payload CMS, content editors can manage the entire website without touching code, while developers benefit from a type-safe, well-structured content API.

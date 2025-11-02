# Backend Development Guide (Payload CMS)

## Payload CMS Architecture

### Configuration Overview
```typescript
// payload.config.ts
export default buildConfig({
  admin: {
    user: Users.slug, // Admin users collection
  },
  localization: {
    defaultLocale: 'pt',
    locales: [
      { label: 'Portuguese', code: 'pt' },
      { label: 'English', code: 'en', fallbackLocale: 'pt' }
    ],
    fallback: true,
  },
  collections: [Users, Media, ArtCollection, BoardMember, ...],
  globals: [Header, Footer],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI
  }),
  endpoints: [/* Custom API endpoints */]
});
```

### Database Connection
```bash
# Environment variables required
DATABASE_URI=mongodb://localhost:27017/hawkstars  # or MongoDB Atlas URI
PAYLOAD_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key  
CLOUDINARY_API_SECRET=your-api-secret
```

## Collection Patterns

### Standard Collection Structure
```typescript
// payload/collections/ExampleCollection/index.ts
import { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { anyone } from '../../access/anyone';

export const ExampleCollection: CollectionConfig = {
  slug: 'examples',
  access: {
    admin: authenticated,    // Only logged-in users can access admin
    read: anyone,           // Public read access
    create: authenticated,  // Only admins can create
    update: authenticated,  // Only admins can update  
    delete: authenticated,  // Only admins can delete
  },
  labels: {
    singular: 'Example',
    plural: 'Examples',
  },
  admin: {
    useAsTitle: 'title',    // Field to use as document title
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  fields: [
    // Field definitions here
  ],
};
```

### Localized Fields Pattern
```typescript
// Fields with localization support
{
  name: 'title',
  label: 'Title', 
  type: 'text',
  localized: true,  // Enables pt/en versions
  required: true,
},
{
  name: 'description',
  label: 'Description',
  type: 'richText',
  localized: true,
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [...rootFeatures, HeadingFeature()]
  })
}
```

### Relationship Fields
```typescript
// One-to-one relationship
{
  name: 'artist',
  label: 'Artist',
  type: 'relationship',
  relationTo: 'curators',
  hasMany: false,           // Single relationship
  required: true,
  admin: {
    allowCreate: false,     // Don't allow inline creation
    allowEdit: false,       // Don't allow inline editing
  },
},

// One-to-many relationship  
{
  name: 'categories',
  label: 'Categories',
  type: 'relationship', 
  relationTo: 'categories',
  hasMany: true,            // Multiple relationships
}
```

### Media/Upload Fields
```typescript
{
  name: 'image',
  label: 'Featured Image',
  type: 'upload',
  relationTo: 'media',
  required: true,
  admin: {
    description: 'Upload artwork image (recommended: 1200x800px)'
  }
},
{
  name: 'gallery',
  label: 'Image Gallery', 
  type: 'upload',
  relationTo: 'media',
  hasMany: true,            // Multiple images
}
```

## Collection Examples

### Art Collection Structure
```typescript
// payload/collections/ArtCollection/index.ts
export const ArtCollection: CollectionConfig = {
  slug: 'artworks',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'slug',
              type: 'text', 
              unique: true,
              hooks: {
                beforeChange: [({ data }) => 
                  data?.title?.replace(/\s+/g, '-').toLowerCase()
                ]
              }
            },
            {
              name: 'artist',
              type: 'relationship',
              relationTo: 'curators',
              required: true,
            },
            {
              name: 'year',
              type: 'number',
              min: 1800,
              max: new Date().getFullYear(),
            },
            {
              name: 'price',
              type: 'number',
              min: 0,
            },
            {
              name: 'is_sold',
              type: 'checkbox',
              defaultValue: false,
            }
          ]
        }
      ]
    }
  ]
};
```

### Event Collection with Date Handling
```typescript
export const HawkEvent: CollectionConfig = {
  slug: 'events',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'start_date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime'
        }
      }
    },
    {
      name: 'end_date', 
      type: 'date',
      admin: {
        condition: (data) => data.start_date, // Only show if start_date exists
      }
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
        },
        {
          name: 'address',
          type: 'textarea',
        }
      ]
    }
  ]
};
```

## Access Control Patterns

### Custom Access Rules
```typescript
// payload/access/ownerOrAdmin.ts
import type { Access } from 'payload';

export const ownerOrAdmin: Access = ({ req: { user } }) => {
  if (user?.role === 'admin') return true;
  
  return {
    user: {
      equals: user?.id, // User can only access their own documents
    },
  };
};

// Usage in collection
export const UserPosts: CollectionConfig = {
  access: {
    read: ownerOrAdmin,
    create: authenticated,
    update: ownerOrAdmin,
    delete: ownerOrAdmin,
  }
};
```

### Role-Based Access
```typescript
// Check user roles in access functions
const adminOnly: Access = ({ req: { user } }) => {
  return user?.role === 'admin';
};

const editorOrAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.role === 'editor';
};
```

## Block-Based Content

### Reusable Content Blocks
```typescript
// payload/blocks/CallToAction/config.ts
export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
          FixedToolbarFeature(),
        ]
      }),
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        }
      ]
    }
  ]
};

// Usage in Pages collection
{
  name: 'layout',
  type: 'blocks',
  blocks: [CallToAction, MediaBlock, /* other blocks */]
}
```

## Custom Endpoints

### API Endpoint Creation
```typescript
// lib/payload/endpoints/customEndpoint.ts
import { PayloadRequest } from 'payload';

const customEndpoint = async (req: PayloadRequest): Promise<Response> => {
  // Access Payload instance
  const { payload } = req;
  
  // Query collections
  const result = await payload.find({
    collection: 'artworks',
    where: {
      is_sold: { equals: false }
    },
    limit: 10,
  });

  return new Response(JSON.stringify(result.docs));
};

export default customEndpoint;

// Register in payload.config.ts
export default buildConfig({
  endpoints: [
    {
      path: '/available-artworks',
      method: 'get', 
      handler: customEndpoint,
    }
  ]
});
```

### Aggregation Queries
```typescript
// Example: Calculate total contributions
const totalContributions = async (req: PayloadRequest): Promise<Response> => {
  const result = await req.payload.find({
    collection: 'contributions',
  });

  const sum = result.docs.reduce((total, doc) => total + (doc.value || 0), 0);

  return new Response(JSON.stringify({ 
    total: sum,
    count: result.totalDocs 
  }));
};
```

## Hooks and Validation

### Field Validation
```typescript
{
  name: 'email',
  type: 'email',
  validate: (value) => {
    if (!value?.includes('@')) {
      return 'Please provide a valid email address';
    }
    return true;
  }
},
{
  name: 'price',
  type: 'number',
  validate: (value) => {
    if (value < 0) {
      return 'Price cannot be negative';
    }
    return true;
  }
}
```

### Collection Hooks
```typescript
export const ArtCollection: CollectionConfig = {
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          data.created_by = req.user.id;
        }
        return data;
      }
    ],
    afterChange: [
      ({ doc, operation }) => {
        if (operation === 'create') {
          // Send notification, update cache, etc.
        }
      }
    ]
  }
};
```

## Querying Data

### Server-Side Data Fetching
```typescript
import { getPayload } from 'payload';

// In Next.js server components or API routes
export async function getArtworks(locale: string) {
  const payload = await getPayload();
  
  const artworks = await payload.find({
    collection: 'artworks',
    locale, // Use provided locale
    where: {
      _status: { equals: 'published' }
    },
    sort: '-createdAt',
    limit: 12,
  });

  return artworks.docs;
}
```

### Complex Queries
```typescript
// Query with relationships and conditions
const featuredArtworks = await payload.find({
  collection: 'artworks',
  where: {
    and: [
      {
        is_sold: { equals: false }
      },
      {
        price: { 
          greater_than: 100,
          less_than: 5000
        }
      },
      {
        'artist.name': { contains: 'Silva' }
      }
    ]
  },
  populate: {
    artist: true, // Populate relationship
  }
});
```

## Type Safety

### Generated Types Usage
```typescript
// payload-types.ts is auto-generated
import type { ArtCollection, Curator, Media } from '@/payload-types';

// Type-safe data handling
const processArtwork = (artwork: ArtCollection) => {
  // TypeScript knows the shape of artwork
  return {
    id: artwork.id,
    title: artwork.title,
    artistName: (artwork.artist as Curator).name,
    imageUrl: (artwork.image as Media).url,
    isSold: artwork.is_sold,
  };
};
```

### Regenerating Types
```bash
# Run after schema changes
pnpm payload:generate

# This updates payload-types.ts with current schema
```

## Global Configuration

### Header/Footer Globals
```typescript
// payload/globals/Header/config.ts
export const Header: GlobalConfig = {
  slug: 'header',
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
        }
      ]
    }
  ]
};

// Access in frontend
const header = await payload.findGlobal({
  slug: 'header',
  locale: lng
});
```

## Media Management

### Cloudinary Integration
```typescript
// Configured in payload/plugins/index.ts
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';

export const plugins = [
  cloudStorage({
    collections: {
      media: {
        adapter: cloudinaryAdapter({
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_API_KEY,
          apiSecret: process.env.CLOUDINARY_API_SECRET,
        }),
      },
    },
  }),
];
```

### File Upload Configuration
```typescript
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        crop: 'center'
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        crop: 'center'
      }
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  }
};
```

This backend guide covers the essential patterns for working with Payload CMS in HawkStars. Always regenerate types after schema changes and follow the established access control patterns.
# Frontend Development Guide

## Next.js App Router Architecture

### Route Structure

```
app/
├── [lng]/                 # Internationalized routes
│   ├── layout.tsx         # Root layout with AppProvider
│   ├── page.tsx          # Home page
│   ├── loading.tsx       # Global loading UI
│   ├── about/page.tsx    # Static pages
│   ├── art/
│   │   ├── page.tsx      # Gallery listing
│   │   └── [slug]/page.tsx # Individual artwork
│   ├── events/
│   │   ├── page.tsx      # Events listing
│   │   └── [slug]/page.tsx # Event details
│   └── contribute/page.tsx
└── (payload)/            # CMS admin (excluded from i18n)
    └── admin/[[...segments]]/page.tsx
```

### Language Parameter Handling

Every public route receives `lng` parameter:

```typescript
// Page component signature
export default async function Page({
  params: { lng }
}: {
  params: { lng: Language }
}) {
  // Use lng for server-side data fetching
  const data = await getLocalizedContent(lng);
  return <PageContent data={data} />;
}
```

## Component Architecture

### Folder-Based Organization

```
components/
├── home/
│   ├── HomeHeroSection/
│   │   └── index.tsx          # Default export component
│   ├── TopSlider/
│   │   ├── index.tsx
│   │   └── config.ts          # Component configuration
├── utils/
│   ├── Button.tsx             # Shared UI components
│   ├── Avatar.tsx
│   └── Dropdown.tsx
└── layout/
    ├── Section.tsx            # Layout helpers
    └── OffsetSection.tsx
```

### Component Patterns

#### Client Components with Hooks

```typescript
'use client';

import { useTranslation } from 'react-i18next';
import { useMainAppContext } from '@/utils/contexts/AppProvider';

const MyComponent = () => {
  const { t } = useTranslation('common'); // No lng param needed
  const { lng, mobileNavbarOpen } = useMainAppContext();

  return (
    <div>
      <h1>{t('section.title')}</h1>
      {/* Component content */}
    </div>
  );
};
```

#### Custom Button with Variants

```typescript
import Button from '@/components/utils/Button';

<Button
  type="button"
  variant="success"
  padding="lg"
  rounded="xl"
  onClick={handleClick}
  loading={isSubmitting}
>
  {t('buttons.submit')}
</Button>
```

#### URL Management

```typescript
import { urls, transformUrl } from '@/utils/paths';
import { useMainAppContext } from '@/utils/contexts/AppProvider';

const Navigation = () => {
  const { lng } = useMainAppContext();

  return (
    <nav>
      <Link href={transformUrl(lng, urls.about)}>
        {t('nav.about')}
      </Link>
      <a href={BE_MEMBER_FORM_URL} target="_blank">
        {t('nav.become_member')}
      </a>
    </nav>
  );
};
```

## Internationalization Implementation

### Client-Side Translation

```typescript
// Use in client components
const { t } = useTranslation('common');

// Access translations
t('home.title'); // Simple key
t('buttons.submit'); // Nested key
t('errors.required', { field: 'email' }); // With interpolation
```

### Server-Side Translation

```typescript
// For server components and metadata
import { createTranslation } from '@/i18n';

export async function generateMetadata({ params: { lng } }) {
  const { t } = await createTranslation(lng, 'common');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}
```

### Language Context

```typescript
// Access current language anywhere
const { lng } = useMainAppContext();

// Transform URLs for internal navigation
const localizedUrl = transformUrl(lng, urls.gallery);

// Set mobile navigation state
const { mobileNavbarOpen } = useMainAppContext();
```

## Styling System

### Custom Typography Classes

```css
/* Defined in app/globals.css */
.text-h1_semibold {
  /* Large heading, semibold weight */
}
.text-h2_light {
  /* Medium heading, light weight */
}
.text-h2_bold {
  /* Medium heading, bold weight */
}
```

Usage in components:

```tsx
<h1 className="text-h1_semibold lg:text-h2_bold">
  {t('home.title')}
</h1>
<p className="text-h2_light lg:text-justify">
  {t('home.description')}
</p>
```

### Brand Colors

```css
/* CSS Variables in app/globals.css */
:root {
  --color-bege-light: #fef9f6;
  --color-green: #2d5a27;
}
```

Usage with Tailwind:

```tsx
<section className='bg-bege-light'>
  <div className='text-green'>Content here</div>
</section>
```

### Responsive Design Patterns

```tsx
// Mobile-first with desktop overrides
<div className='/* Mobile: stack vertically */ /* Desktop: horizontal layout */ /* Responsive padding */ /* Responsive top spacing */ flex flex-col gap-2 px-8 pt-10 lg:flex-row lg:gap-5 lg:px-14 lg:pt-40'>
  <div className='lg:w-1/2'>
    {' '}
    {/* Half width on desktop */}
    Content
  </div>
</div>
```

## Data Fetching Patterns

### Server Components (Recommended)

```typescript
import { getPayload } from 'payload';

export default async function GalleryPage({
  params: { lng }
}: {
  params: { lng: Language }
}) {
  const payload = await getPayload();

  const artworks = await payload.find({
    collection: 'artworks',
    locale: lng,
    where: {
      _status: { equals: 'published' }
    }
  });

  return <GalleryGrid artworks={artworks.docs} />;
}
```

### Client Components with State

```typescript
'use client';

const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    const response = await fetch(`/api/artworks?locale=${lng}`);
    const result = await response.json();
    setData(result);
    setLoading(false);
  };

  fetchData();
}, [lng]);
```

## Form Handling

### React Hook Form Integration

```typescript
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  message: string;
};

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Handle form submission
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', { required: 'Email is required' })}
        type="email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {t('buttons.submit')}
      </Button>
    </form>
  );
};
```

## Image Optimization

### Next.js Image with Cloudinary

```typescript
import Image from 'next/image';

const ArtworkCard = ({ artwork }) => (
  <div className="relative aspect-square">
    <Image
      src={artwork.image.url} // Cloudinary URL from Payload
      alt={artwork.image.alt || artwork.title}
      fill
      className="object-cover rounded-lg"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
```

## Performance Best Practices

### Code Splitting

```typescript
// Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // Client-side only if needed
});
```

### Suspense Boundaries

```tsx
<Suspense fallback={<SliderSkeleton />}>
  <ErasmusSlider events={events} />
</Suspense>
```

### Type Safety with Payload

```typescript
import type { ArtCollection, Media } from '@/payload-types';

interface ArtworkCardProps {
  artwork: ArtCollection;
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  // TypeScript knows artwork shape from generated types
  return (
    <div>
      <h3>{artwork.title}</h3>
      <p>{artwork.artist}</p>
      {artwork.is_sold && <span>SOLD</span>}
    </div>
  );
};
```

## Testing Components

### Component Testing Patterns

```typescript
// Test component with i18n context
const renderWithI18n = (component, lng = 'pt') => {
  return render(
    <AppProvider lng={lng}>
      {component}
    </AppProvider>
  );
};

describe('HomeHeroSection', () => {
  it('renders translated content', () => {
    renderWithI18n(<HomeHeroSection />);
    expect(screen.getByText(/title from translation/)).toBeInTheDocument();
  });
});
```

This frontend guide covers the essential patterns for building components in the HawkStars application. Always prioritize type safety, accessibility, and performance in your implementations.

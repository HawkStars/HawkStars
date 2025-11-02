---
applyTo: "*"
---

# HawkStars Project Overview

## Project Mission
HawkStars is a cultural organization's website showcasing contemporary art, events, and community initiatives. The platform serves as both a content management system for administrators and a public-facing multilingual website for visitors.

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15 with App Router + React 19 + TypeScript
- **Backend**: Payload CMS 3.x (headless CMS)
- **Database**: MongoDB with Mongoose adapter
- **Styling**: Tailwind CSS with custom design system
- **Internationalization**: i18next (Portuguese/English)
- **Media**: Cloudinary integration
- **Monitoring**: Sentry error tracking

### Core Features
1. **Multilingual Content**: Portuguese (default) and English with automatic language detection
2. **Art Gallery**: Dynamic artwork showcase with artist information and sales status
3. **Event Management**: Cultural events with date/time handling
4. **Content Management**: Rich text content via Payload CMS with localized fields
5. **Team & Partner Management**: Board members, curators, and organization partners
6. **Contribution Tracking**: Financial transparency with donation goals and progress

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── [lng]/             # Internationalized routes (pt/en)
│   │   ├── about/         # Organization information
│   │   ├── art/           # Gallery and artwork pages
│   │   ├── events/        # Event listings and details
│   │   ├── contribute/    # Donation and membership
│   │   └── transparency/  # Financial transparency
│   └── (payload)/         # CMS admin routes (excluded from i18n)
├── components/            # React components organized by feature
├── payload/              # Payload CMS configuration
│   ├── collections/      # Content type definitions
│   ├── globals/          # Site-wide settings
│   └── blocks/           # Reusable content blocks
├── i18n/                 # Internationalization setup
├── utils/                # Shared utilities and helpers
└── public/               # Static assets
```

## Development Workflow

### Getting Started
```bash
# Install dependencies
pnpm install

# Start development server with Turbopack
pnpm dev

# Access the application
# Frontend: http://localhost:3000
# CMS Admin: http://localhost:3000/admin
```

### Key Commands
```bash
pnpm dev              # Development with Turbopack
pnpm build            # Production build
pnpm payload:generate # Regenerate CMS TypeScript types
pnpm format:fix       # Format code with Prettier + Tailwind sorting
```

## Content Management

### Payload CMS Collections
- **Artworks**: Gallery pieces with artist info, pricing, sold status
- **Events**: Cultural events with dates and descriptions  
- **Pages**: Dynamic page content with blocks
- **Board Members**: Team information with roles
- **Curators**: Artist curator profiles
- **Partners**: Organization partnerships
- **Contributions**: Financial tracking and transparency
- **Media**: Cloudinary-integrated asset management

### Access Control
- **Public**: Read access to published content
- **Authenticated**: Full CRUD operations for admins
- **Localized**: Content supports Portuguese and English versions

## Key Integrations

### Internationalization Flow
1. **Middleware Detection**: `middleware.ts` detects language from URL, cookies, or headers
2. **Route Handling**: All public routes use `/[lng]/path` pattern
3. **Content Localization**: CMS collections support `pt`/`en` versions
4. **Client Translation**: React components use `useTranslation()` hook

### External Services
- **Cloudinary**: Image storage, optimization, and delivery
- **Sentry**: Error tracking and performance monitoring
- **MongoDB Atlas**: Database hosting (recommended)

## Development Guidelines

### File Organization
- Components use folder-based structure with `index.tsx` exports
- Utilities are single-purpose functions in `utils/`
- All internal URLs defined in `utils/paths.ts` constants
- Types auto-generated from Payload schema in `payload-types.ts`

### Styling Conventions  
- Tailwind usage at the majority of the styling
- Custom typography classes: `text-h1_semibold`, `text-h2_light`
- Brand colors via CSS variables: `--color-bege-light`, `--color-green`
- Mobile-first responsive design with `lg:` breakpoints
- Component variants using `classname-variants` library

### State Management
- Global app state via `AppProvider` context (language, mobile nav)
- Access current language: `useMainAppContext().lng`
- Form state: React Hook Form for complex forms
- Server state: Direct Payload API integration

## Security & Performance

### Content Security Policy
- Strict CSP headers in production (`next.config.ts`)
- Cloudinary and Google services whitelisted
- Sentry integration configured

### Performance Optimizations
- Next.js Image component with Cloudinary optimization
- Turbopack for faster development builds
- Static generation for public pages where possible
- Lazy loading for non-critical components

This overview provides the foundation for understanding HawkStars' architecture. See `frontend.md` and `backend.md` for detailed implementation guidance.
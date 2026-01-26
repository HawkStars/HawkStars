# HawkStars Codebase Guide

## Architecture Overview

This is a multilingual Next.js 15 application with Payload CMS backend, focused on a cultural organization's website. The architecture emphasizes internationalization (pt/en), headless CMS content management, and modern React patterns.

**Key Stack**: Next.js 15 + PayloadCMS 3.x + MongoDB + Tailwind + TypeScript + i18next

## Critical Development Patterns

### App Router Structure

- **`app/[lng]/`**: Internationalized routes with language parameter (`pt`, `en`)
- **`app/(payload)/`**: Payload admin panel routes (excluded from i18n middleware)
- **Component Structure**: Index files with folder-based organization (`components/home/HomeHeroSection/index.tsx`)

### Internationalization (i18n)

- **Language handling**: Automatic detection via `middleware.ts` → redirects to `/[lng]/path` using `withHandleInternalization`
- **Client translations**: Use `useTranslation('common')` from React i18next (no lng param needed in client)
- **Language context**: Access current language via `useMainAppContext().lng` from `AppProvider`
- **Path transformation**: Always use `transformUrl(lng, path)` from `utils/paths.ts` for internal links

  ```typescript
  // Example usage:
  import { urls, transformUrl } from '@/utils/paths'

  // In component with language context
  const { lng } = useMainAppContext()
  const aboutUrl = transformUrl(lng, urls.about) // → "/pt/about" or "/en/about"

  // Direct usage
  <Link href={transformUrl('pt', urls.gallery)}>Gallery</Link>
  ```

- **Default locale**: Portuguese (`pt`) with English (`en`) fallback
- **Cookie handling**: Language preference stored in `i18next` cookie, managed by middleware

### Payload CMS Integration

Payload is responsible for the content management of the site, which populates a mongoDB database.
This is considered the source of truth for all content on the site with a few exceptions that is populated with the yml files in the `i18n/locales` folder.

- **Collections**: `ArtCollection`, `Pages`, `Contribution`, `HawkEvent`, `BoardMember`, `Curator`, `Partner`
- **Access patterns**: `authenticated` for CRUD, `anyone` for read operations
- **Type generation**: Run `pnpm payload:generate` after schema changes
- **Localized content**: Collections support pt/en via `localization` config
- **When adding blocks**: Create block config + component → Add to collections → Update `app/(payload)/importMap` → Regenerate types with `pnpm payload:generate -- --importMap`

#### Block Development Workflow

1. Create block folder: `payload/blocks/BlockName/`
2. Create `config.ts` with Payload field definitions
3. Create `Component.tsx` with React component
4. Add block to collections (e.g., `Pages` layout blocks array)
5. Update `app/(payload)/importMap` to register component for rendering
6. Run `pnpm payload:generate` to update TypeScript types
7. Run `pnpm payload:generate -- --importMap` to update import mapping

### Component Conventions

- **Client components**: Use `'use client'` directive for interactivity/hooks for the client components
- **Components**: Use existing components when possible. For new components, follow shadcn UI folder-based organization with `index.tsx` exports. Only create new components when existing ones don't fit the requirements - then use shadcn patterns and modify for project needs.
- **Button component**: Custom `Button` component with `classname-variants` and variant props in `components/utils/Button.tsx`
- **URL constants**: Import from `utils/paths.ts` - never hardcode paths (use `urls` object)
- **External URLs**: Constants like `BE_MEMBER_FORM_URL` also defined in `utils/paths.ts`
- **Styling**: Primarily Tailwind CSS. Custom classes (e.g., `text-h1_semibold`, `bg-bege-light`) are added only for clarity or when Tailwind doesn't support specific CSS requirements. Most styling uses default Tailwind utilities.
- **State management**: Global state via `AppProvider` context (mobile nav, language) - use `useMainAppContext()`
- **Navigation**: Use `NavbarUrlItem` type for menu structures, `transformUrl()` for routing
- **Image handling**: Next.js Image with Cloudinary integration for remote patterns

### Payload CMS Folder Structure

- **`payload/access/`**: Access control logic for collections and globals
- **`payload/blocks/`**: Reusable blocks for rich text and modular content
- **`payload/collections/`**: Define your content types and schemas here
- **`payload/components/`**: Shared React components used in Payload admin UI
- **`payload/fields/`**: Custom field definitions for Payload CMS
- **`payload/globals/`**: Global fields and settings for your CMS
- **`payload/hooks/`**: Custom hooks for interacting with Payload CMS
- **`payload/plugins/`**: Custom plugins for extending Payload functionality based mostly on existing Payload plugins
- **`payload/utilities/`**: Helper functions for Payload operations

## Development Commands

### Development
```bash
pnpm dev              # Start Next.js dev server with Turbopack
pnpm dev:inspect      # Start dev server with Node.js inspector for debugging
```

### Building
```bash
pnpm build            # Production build with Next.js
pnpm start            # Start production server
```

### Code Quality
```bash
pnpm lint             # Check code with ESLint
pnpm format           # Check formatting with Prettier
pnpm format:fix       # Auto-format with Prettier + Tailwind plugin
pnpm tsc              # Type check with TypeScript compiler
```

### Payload CMS
```bash
pnpm payload:generate          # Regenerate TypeScript types from CMS schema
pnpm payload:generateMapping   # Generate import map for Payload blocks
```

### Storybook
```bash
pnpm storybook        # Start Storybook dev server (port 6006)
pnpm build-storybook  # Build static Storybook
```

## External Integrations

- **Media**: Cloudinary for image storage/optimization
- **Monitoring**: Sentry for error tracking
- **Database**: MongoDB via Mongoose adapter
- **Forms**: Google Forms integration for membership

## File Naming & Organization

- **Pages**: `app/[lng]/section/page.tsx` pattern
- **Components**: Folder-based with `index.tsx` exports
- **Collections**: PayloadCMS collections in `payload/collections/`
- **Utilities**: Helper functions in `utils/` with clear single responsibilities
- **Types**: Generated types in `payload-types.ts` (auto-generated)

## Key Configuration Files

- **`payload.config.ts`**: CMS schema, collections, globals, endpoints
- **`middleware.ts`**: i18n routing logic (excludes `/admin` routes)
- **`i18n/settings.ts`**: Language configuration and utilities
- **`next.config.ts`**: CSP headers, Cloudinary images, Payload integration

## Common Patterns

- **Language detection**: Use `withHandleInternalization` middleware pattern with cookie fallback
- **Type safety**: Leverage generated `payload-types.ts` for CMS data (auto-regenerated)
- **Responsive design**: Mobile-first with `lg:` breakpoint modifiers
- **Form handling**: React Hook Form with validation patterns
- **Image optimization**: Next.js Image component with Cloudinary remote patterns
- **Typography system**: Custom classes like `text-h1_semibold`, `text-h2_light` defined in `globals.css`
- **Color system**: Custom CSS variables (`--color-bege-light`, `--color-green`) in theme config
- **Component variants**: Use `classname-variants` for styled components with TypeScript props
- **Router handling**: Use Next.js `useRouter` from `next/navigation` (App Router)

## Testing & Quality

### Testing Infrastructure

- **Storybook**: Component development and visual testing for Payload blocks
  - Run: `pnpm storybook` (port 6006)
  - Build: `pnpm build-storybook`
  - All Payload blocks have corresponding `.stories.tsx` files
  - Addons: Chromatic (visual testing), a11y (accessibility), vitest (testing integration)
- **Vitest**: Unit testing framework configured with Playwright browser testing
  - Browser testing: `@vitest/browser-playwright`
  - Coverage: `@vitest/coverage-v8`
- **Type Checking**: Run `pnpm tsc` to check TypeScript errors before committing
- **Linting**: ESLint with Next.js and Prettier configs
  - Run: `pnpm lint` (errors block commits)
  - Auto-fix: `pnpm format:fix`
- **Format**: Prettier with Tailwind class sorting plugin (`prettier-plugin-tailwindcss`)
  - Check: `pnpm format`
  - Fix: `pnpm format:fix`

### Quality Standards

- **Max line length**: 140 characters (enforced by ESLint)
- **Type safety**: Strict TypeScript enabled - no `any` types without justification
- **Accessibility**: All interactive components should be tested with a11y addon in Storybook
- **Security**: CSP headers configured in `next.config.ts` for production
- **Visual regression**: Chromatic integration for visual testing in CI/CD

### Pre-commit Checks

Before committing, ensure:
1. `pnpm lint` passes (no errors)
2. `pnpm tsc` passes (no type errors)
3. `pnpm format` passes (no formatting issues)
4. All imports resolve correctly
5. No console errors in browser/terminal

## Deployment & CI/CD

### GitHub Actions Workflow

The repository uses GitHub Actions for automated deployment (`.github/workflows/deploy.yml`):

**Trigger**: Push to `main` branch

**Jobs**:
1. **check**: Validates code quality
   - Runs `pnpm lint` to check code style
   - Runs `pnpm tsc` to verify type safety
   - Fails deployment if either check fails

2. **deploy**: Deploys to production VPS
   - Connects via SSH to production server
   - Pulls latest code from `main` branch
   - Creates `.env` file with secrets
   - Installs dependencies with `pnpm install --frozen-lockfile`
   - Deletes `.next` folder for clean build
   - Runs `pnpm build` to create production build
   - Starts/restarts app with PM2 (`pm2 start npm --name "hawkstars" -- start`)
   - Updates GitHub deployment status

3. **storybook**: Builds and deploys Storybook
   - Publishes to Chromatic for visual regression testing
   - Uses `CHROMATIC_PROJECT_TOKEN` secret

### Environment Variables

**Required for Production**:
- `NODE_ENV`: Set to `production`
- `NEXT_PUBLIC_APP_URL`: Public URL of the application
- `PAYLOAD_SECRET`: Secret key for Payload CMS authentication
- `DATABASE_URI`: MongoDB connection string
- `SENTRY_AUTH_TOKEN`: Sentry authentication token for error tracking
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name for media storage
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

**Security Notes**:
- ⚠️ **NEVER commit `.env` files or secrets to git** - they are in `.gitignore` for a reason
- Use GitHub Secrets for CI/CD environment variables
- Restrict `.env` file permissions: `chmod 600 .env` in production
- Rotate secrets regularly, especially if exposed
- Use different secrets for development/staging/production environments

**Development**: Copy `.env.variables` to `.env.local` and fill in values

### Deployment Flow

```
Push to main → Lint & Type Check → SSH to VPS → Pull Code → 
Install Deps → Build → Start with PM2 → Update Status
```

**Important**: Deployment fails if lint or type checks fail. Always run `pnpm lint` and `pnpm tsc` locally before pushing to `main`.

## Security & Best Practices

### Security Considerations

1. **Environment Variables**: Never commit `.env` files or secrets to git
2. **CSP Headers**: Content Security Policy configured in `next.config.ts`
3. **Authentication**: Payload CMS admin panel requires authentication (`/admin` routes)
4. **Access Control**: Collections use `authenticated` access for CRUD, `anyone` for read
5. **Image Security**: All media uploads go through Cloudinary, not stored locally
6. **Sentry Integration**: Error tracking enabled for production monitoring

### Code Review Standards

When reviewing PRs, check for:
- [ ] Type safety: No `any` types, proper TypeScript usage
- [ ] Accessibility: Proper semantic HTML, ARIA labels where needed
- [ ] Performance: Optimize images, lazy load components where appropriate
- [ ] Security: No hardcoded secrets, proper input validation
- [ ] i18n: All user-facing text uses translation system
- [ ] URL handling: All internal links use `transformUrl(lng, path)`
- [ ] Payload integration: New blocks registered in `importMap`
- [ ] Tests: Storybook stories for new Payload blocks
- [ ] Documentation: Update relevant docs for significant changes

### Common Pitfalls & Troubleshooting

#### Build Issues

**Problem**: `pnpm build` fails with module not found
- **Solution**: Run `pnpm install --frozen-lockfile` to ensure all dependencies are installed
- **Solution**: Clear build cache: `rm -rf .next && pnpm build`
- **Check**: Verify `pnpm-lock.yaml` is in sync with `package.json`

**Problem**: Type errors after adding/modifying Payload blocks
- **Solution**: Run `pnpm payload:generate` to regenerate types
- **Solution**: Run `pnpm payload:generateMapping` if block not rendering

**Problem**: Build fails with memory issues
- **Solution**: Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=4096" pnpm build`
- **Note**: Adjust memory value (2048-8192) based on project size and available system RAM
- **Alternative**: Try `NODE_OPTIONS="--max-old-space-size=2048"` first, increase if still failing

#### Development Issues

**Problem**: i18n not working, always shows default language
- **Solution**: Check middleware is running, verify `i18next` cookie is set
- **Solution**: Use `transformUrl(lng, path)` for all internal links, not raw paths

**Problem**: Payload block not rendering on frontend
- **Solution**: Add block component to `app/(payload)/importMap`
- **Solution**: Run `pnpm payload:generate -- --importMap` to update import mapping
- **Solution**: Verify block is added to collection's `blocks` array

**Problem**: Images not loading from Cloudinary
- **Solution**: Verify Cloudinary credentials in `.env`
- **Solution**: Check `next.config.ts` has Cloudinary domain in `remotePatterns`
- **Solution**: Ensure image URLs use correct Cloudinary format

**Problem**: Tailwind classes not working
- **Solution**: Check class name is valid Tailwind utility or defined in `globals.css`
- **Solution**: Verify `tailwind.config.ts` includes file path in `content` array
- **Solution**: Custom classes must be defined in `@layer` directives

#### Payload CMS Issues

**Problem**: Can't access admin panel (`/admin`)
- **Solution**: Ensure MongoDB is running and `DATABASE_URI` is correct
- **Solution**: Check Payload configuration in `payload.config.ts`
- **Solution**: Verify user exists in database with proper credentials

**Problem**: Localized content not showing in correct language
- **Solution**: Verify collection has `localization: true` in config
- **Solution**: Check field has localized content for both `pt` and `en`
- **Solution**: Use correct language parameter when querying Payload API

**Problem**: Changes to Payload config not reflected
- **Solution**: Restart dev server after config changes
- **Solution**: Run `pnpm payload:generate` to regenerate types
- **Solution**: Clear `.next` folder: `rm -rf .next && pnpm dev`

#### Storybook Issues

**Problem**: Storybook won't start
- **Solution**: Check for TypeScript errors in `.stories.tsx` files
- **Solution**: Verify imports match component exports
- **Solution**: Clear Storybook cache: `rm -rf node_modules/.cache/storybook`

**Problem**: Styles not loading in Storybook
- **Solution**: Ensure `app/globals.css` imported in `.storybook/preview.ts`
- **Solution**: Verify Tailwind config includes story file paths

### Performance Optimization

- **Image Optimization**: Always use Next.js `Image` component with proper sizing
- **Code Splitting**: Use dynamic imports for heavy components: `const Heavy = dynamic(() => import('./Heavy'))`
- **Payload Queries**: Use `depth` parameter to limit nested data fetching
- **Caching**: Leverage Next.js caching strategies for Payload data
- **Bundle Size**: Monitor with `pnpm build` output, lazy load when possible

### Migration & Updates

When updating dependencies:
1. Test locally with `pnpm install` and `pnpm dev`
2. Run full build: `pnpm build`
3. Check for breaking changes in major version updates
4. Update Payload types if Payload version changes: `pnpm payload:generate`
5. Test Storybook still works: `pnpm storybook`
6. Review and update any TypeScript errors

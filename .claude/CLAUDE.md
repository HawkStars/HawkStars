# CLAUDE.md — HawkStars Project Context

## Project Overview

HawkStars is the website for **Associação HawkStars** (Hawk Stars NGO), a Portuguese cultural/humanitarian non-profit organization based in Pinhel. The site is multilingual (Portuguese + English), content-managed via Payload CMS, and deployed to a self-hosted VPS via GitHub Actions.

**Production URL**: https://hawkstars.org

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, ESM modules)
- **CMS**: Payload CMS 3.x (embedded in the same Next.js app)
- **Database**: MongoDB via Mongoose adapter
- **Language**: TypeScript 6 (strict mode)
- **Styling**: Tailwind CSS 4 + custom theme variables in `app/globals.css`
- **i18n**: i18next + react-i18next (Portuguese default, English fallback)
- **Media**: Cloudinary (cloud storage + image optimization)
- **Monitoring**: Sentry (error tracking, source maps)
- **Testing**: Vitest (unit) + Storybook 10 (component dev/visual) + Chromatic (visual regression)
- **Package Manager**: pnpm (lockfile: `pnpm-lock.yaml`)
- **Node**: v24
- **Deployment**: PM2 on VPS, behind Nginx

## Commands

```bash
# Development
pnpm dev                    # Next.js dev server (webpack mode)
pnpm dev:inspect            # Dev with Node.js debugger

# Build & Production
pnpm build                  # Production build (4 GB heap)
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # ESLint check
pnpm format                 # Prettier check
pnpm format:fix             # Prettier auto-fix
pnpm typecheck              # tsc --noEmit (4 GB heap)
pnpm test                   # Vitest run

# Payload CMS
pnpm payload:regenerate     # Regenerate types + import map

# Storybook
pnpm storybook              # Dev server on port 6006
pnpm build-storybook        # Static build
```

## Further Reading

@structure.md
@patterns.md
@page-architecture.md
@ops.md

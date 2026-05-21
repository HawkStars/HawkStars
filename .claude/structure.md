# Project Structure

```
app/
├── (payload)/              # Payload admin panel (/admin)
│   ├── admin/              # Admin UI pages
│   ├── api/                # REST + GraphQL endpoints
│   └── layout.tsx
├── [lng]/                  # Internationalized frontend routes
│   ├── (org)/              # Main organization pages
│   │   ├── page.tsx        # Homepage
│   │   ├── news/           # News listing + [slug]
│   │   ├── projects/       # Projects listing + [slug]
│   │   ├── events/         # Events listing + [slug]
│   │   ├── contribute/     # Donations page
│   │   ├── team/           # Team page
│   │   ├── partners/       # Partners page
│   │   ├── transparency/   # Financial transparency
│   │   ├── art/            # Art gallery
│   │   ├── history/        # Organization history
│   │   ├── agenda/         # Calendar/agenda
│   │   ├── erasmus/        # Erasmus+ hub page
│   │   │   └── key-action/ # Erasmus+ Key Actions guide (KA1–KA3, Jean Monnet, Sport)
│   │   ├── how-to-help-us/ # Become a member or volunteer
│   │   ├── preview/        # CMS live preview routes
│   │   └── [slug]/         # Dynamic CMS pages
│   ├── (crowdfunding)/     # Crowdfunding sub-site
│   └── (gaming)/           # Gaming sub-site
├── api/                    # API routes (donate, easypay, instagram, google)
├── globals.css             # Tailwind + custom theme + typography
└── sitemap.ts

components/                 # Frontend React components
├── Crowdfunding/           # Crowdfunding campaign components
├── GlobalVillage/          # Global Village project components
├── navbar/                 # Main navigation
├── footer/                 # Footer
├── ui/                     # shadcn/ui primitives (button, card, etc.)
├── layout/                 # Section, OffsetSection wrappers
├── contribute/             # Donation-related components
├── team/                   # Team member cards
├── partners/               # Partner cards + Leaflet map
├── transparency/           # Financial reports
├── news/                   # News post components
├── projects/               # Project page components
├── events/                 # Event page components
├── art/                    # Art gallery components
├── payload/                # Payload-specific frontend components
└── utils/                  # Button, shared utilities

payload/                    # Payload CMS configuration
├── access/                 # Access control (anyone, authenticated, admin, editor)
├── blocks/                 # ~40 reusable content blocks (each: config.ts + Component.tsx + stories)
├── collections/            # Content types: Users, Media, Pages, News, HawkProject,
│                           #   HawkEvent, ArtCollection, BoardMember, Contribution,
│                           #   Curator, Partner, Sponsor, Notification, Documents
├── globals/                # Header, Footer, MainPage, NewsList, ProjectsList,
│                           #   EventsList, WebsiteSettings, CrowdfundingSettings
├── components/             # Admin UI components (Logo, RichText, LivePreview, admin panels)
├── fields/                 # Custom fields (Link, Image, SectionID, etc.)
├── hooks/                  # Lifecycle hooks (notifications, status validation, etc.)
├── jobs/                   # Background jobs (Instagram token refresh, notification cleanup)
├── plugins/                # Plugin config (SEO, cloud storage, etc.)
├── endpoints/              # Custom API endpoints (dashboard stats, notifications)
├── migrations/             # DB migrations
└── utilities/              # Helper functions (getURL, getMediaUrl, canUseDOM)

i18n/
├── settings.ts             # Language config: languages=['pt','en'], defaultNS='common'
├── client.ts               # Client-side i18n setup
├── index.ts                # Server-side i18n setup
└── locales/
    ├── pt/                 # Portuguese translations
    └── en/                 # English translations

lib/
├── constants.ts            # BASE_URL, SITE_NAME, OG_IMAGE, GA_MEASUREMENT_ID
├── cloudinary/             # Cloudinary upload/config
├── google-drive/           # Google Drive integration
├── flags/                  # Feature flags
├── payload/                # Payload helpers + custom endpoints
├── utils.ts                # cn() classname merge utility
├── image.ts                # Image utilities
└── icon.tsx                # Icon component

utils/
├── paths.ts                # URL constants (urls object) + transformUrl()
├── metadata.ts             # SEO metadata helpers
├── page.ts                 # Page utilities
├── contexts/               # React contexts (AppProvider)
├── middlewares/             # Middleware utilities (i18n handling)
├── models/                 # Data models
├── payment/                # Payment integration (EasyPay)
└── storybook.ts            # Storybook helpers

types/                      # Global TypeScript declarations
stories/                    # Storybook stories for non-block components
```

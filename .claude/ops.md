# Operations

## Code Quality Rules

- **Max line length**: 140 characters (ESLint enforced)
- **Formatting**: Prettier with `singleQuote: true`, `semi: true`, `tabWidth: 2`, `printWidth: 100`
- **Tailwind sorting**: `prettier-plugin-tailwindcss` auto-sorts classes
- **Strict TypeScript**: No `any` without justification
- **Pre-push hook** (Husky): runs `pnpm lint` + `pnpm tsc` + `pnpm build` (build skipped in CI)

## Environment Variables

Required (see `.env.example`):

| Variable                                               | Purpose                     |
| ------------------------------------------------------ | --------------------------- |
| `DATABASE_URI`                                         | MongoDB connection string   |
| `PAYLOAD_SECRET`                                       | Payload CMS auth secret     |
| `NEXT_PUBLIC_BASE_URL`                                 | Public site URL             |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` | Media storage               |
| `EASYPAY_API_URL/API_KEY/ACCOUNT_ID`                   | Payment processing          |
| `GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN/EMAIL_USER`     | OAuth email + Drive         |
| `SENTRY_AUTH_TOKEN`                                    | Error tracking (production) |

CI-only secrets (GitHub repository secrets, not `.env`): `DISCORD_WEBHOOK_URL` for deploy notifications.

## CI/CD & Deployment

**Workflow**: `.github/workflows/deploy.yml`

```
Push to main → Lint + Type Check → SSH to VPS → git pull →
pnpm install --frozen-lockfile → rm -rf .next → pnpm build →
PM2 restart → Update GitHub deployment status → Notify Discord
```

Storybook is built and published to Chromatic in a separate job.

**Discord notifications**: the `notify` job posts an embed to a Discord channel after every
deploy attempt (`if: always()`), reporting success/failure/cancelled along with the commit,
branch, author, and a link to the workflow run. It requires the repository secret
`DISCORD_WEBHOOK_URL` (Discord → Server Settings → Integrations → Webhooks → Copy Webhook URL).
If the secret is absent the job logs a skip and passes, so forks and secret-less runs are unaffected.

**Important**: Deployment fails if lint or type checks fail. Always run `pnpm lint` and `pnpm typecheck` before pushing to `main`.

## External Integrations

- **Cloudinary**: Image/media storage and CDN optimization
- **Sentry**: Error tracking + performance monitoring (org: `hawkstars`, project: `website`)
- **EasyPay**: Portuguese payment gateway for donations (test + production APIs)
- **Google APIs**: Gmail OAuth2 (email sending), Google Drive (document storage)
- **Instagram**: Graph API for social feed (token auto-refreshed via Payload job)
- **Leaflet**: Interactive maps for partners page
- **Chromatic**: Visual regression testing for Storybook

## LLM SEO

The site serves `llms.txt` and `llms-full.txt` at the root for LLM discoverability (following the llms.txt standard). These are static files in `public/` that describe the organization, its mission, pages, and programmes in a format optimized for language model consumption.

## Common Troubleshooting

- **Build memory errors**: The build script already sets `--max-old-space-size=4096`. Increase if needed.
- **Block not rendering**: Run `pnpm payload:regenerate` and check the block is in the collection's blocks array.
- **Type errors after schema change**: Run `pnpm payload:regenerate`.
- **i18n not working**: Verify middleware is running and links use `transformUrl()`.
- **Images broken**: Check Cloudinary credentials and `next.config.ts` `remotePatterns`.
- **Storybook styles missing**: Ensure `globals.css` is imported in `.storybook/preview.ts`.
- **Clean rebuild**: `rm -rf .next && pnpm dev`

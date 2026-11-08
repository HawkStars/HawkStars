import type { AllowList } from 'payload';

/**
 * Hosts the server may download upload files from when a document is created from a URL
 * (`{ filename, url }`) — via the MCP `createMedia` / `createDocuments` tools or the admin's
 * "Paste URL" option.
 *
 * Without an allow-list any API key could make the server fetch any public URL. Matching is
 * exact on hostname (Payload supports no wildcards), and every redirect target is checked too,
 * so redirect hosts (e.g. `drive.usercontent.google.com` for Drive downloads) must be listed.
 * HTTPS only. Add a host here when a trusted source is rejected with "The provided file URL is
 * not allowed".
 */
const https = (hostname: string): AllowList[number] => ({ protocol: 'https', hostname });

const SITE_HOSTS = [https('hawkstars.org'), https('www.hawkstars.org')];

const GOOGLE_DRIVE_HOSTS = [https('drive.google.com'), https('drive.usercontent.google.com')];

export const MEDIA_URL_ALLOW_LIST: AllowList = [
  ...SITE_HOSTS,
  ...GOOGLE_DRIVE_HOSTS,
  https('lh3.googleusercontent.com'), // Google Photos / Drive image previews
  https('res.cloudinary.com'),
  https('images.unsplash.com'),
];

export const DOCUMENT_URL_ALLOW_LIST: AllowList = [
  ...SITE_HOSTS,
  ...GOOGLE_DRIVE_HOSTS,
  https('docs.google.com'),
];

// Plain data (no Payload imports) so the admin select and the profile buttons
// on the site share one list.
export const PROFILE_LINK_PLATFORMS = [
  { value: 'website', label: { en: 'Website', pt: 'Website' } },
  { value: 'blog', label: { en: 'Blog', pt: 'Blog' } },
  { value: 'instagram', label: { en: 'Instagram', pt: 'Instagram' } },
  { value: 'facebook', label: { en: 'Facebook', pt: 'Facebook' } },
  { value: 'linkedin', label: { en: 'LinkedIn', pt: 'LinkedIn' } },
  { value: 'youtube', label: { en: 'YouTube', pt: 'YouTube' } },
  { value: 'tiktok', label: { en: 'TikTok', pt: 'TikTok' } },
  { value: 'other', label: { en: 'Other', pt: 'Outro' } },
] as const;

export type ProfileLinkPlatform = (typeof PROFILE_LINK_PLATFORMS)[number]['value'];

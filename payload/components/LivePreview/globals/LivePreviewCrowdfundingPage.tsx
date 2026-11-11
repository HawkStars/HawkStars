'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { CrowdfundingSetting } from '@/payload-types';
import { Language } from '@/i18n/settings';
import CrowdfundingPageContent from '@/components/Crowdfunding/CrowdfundingPageContent';
import { useTranslation } from '@/i18n/client';

type LivePreviewCrowdfundingPageProps = {
  initialData: CrowdfundingSetting;
  serverURL: string;
  lng: Language;
};

export const LivePreviewCrowdfundingPage: React.FC<LivePreviewCrowdfundingPageProps> = ({
  initialData,
  serverURL,
  lng,
}) => {
  const { data } = useLivePreview<CrowdfundingSetting>({
    initialData,
    serverURL,
    depth: 2,
  });

  const { t } = useTranslation(lng, 'crowdfunding');

  if (!data) return null;

  return <CrowdfundingPageContent settings={data} t={t} lng={lng} />;
};

'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { CrowdfundingSetting } from '@/payload-types';
import { Language } from '@/i18n/settings';
import {
  CrowdfundingHero,
  CrowdfundingVideo,
  CrowdfundingAbout,
  CrowdfundingTransparency,
  CrowdfundingRewards,
  CrowdfundingUpdates,
  CrowdfundingBusiness,
  CrowdfundingPartners,
  CrowdfundingFAQ,
  CrowdfundingCTA,
} from '@/components/Crowdfunding';
import { useTranslation } from '@/i18n/client';

type LivePreviewData = {
  settings: CrowdfundingSetting;
};

type LivePreviewCrowdfundingPageProps = {
  initialData: LivePreviewData;
  serverURL: string;
  lng: Language;
};

export const LivePreviewCrowdfundingPage: React.FC<LivePreviewCrowdfundingPageProps> = ({
  initialData,
  serverURL,
  lng,
}) => {
  const { data } = useLivePreview<LivePreviewData>({
    initialData,
    serverURL,
    depth: 2,
  });

  const { t } = useTranslation(lng, 'crowdfunding');

  if (!data) return null;
  const { settings } = data;

  return (
    <div className='bg-crowdfunding-bg flex flex-col'>
      <CrowdfundingHero {...settings} t={t} />
      <CrowdfundingVideo {...settings} t={t} />
      <CrowdfundingAbout {...settings} t={t} />
      <CrowdfundingTransparency {...settings} t={t} />
      <CrowdfundingRewards {...settings} t={t} />
      <CrowdfundingUpdates {...settings} t={t} />
      <CrowdfundingBusiness {...settings} t={t} />
      <CrowdfundingPartners {...settings} t={t} />
      <CrowdfundingFAQ {...settings} t={t} />
      <CrowdfundingCTA {...settings} t={t} />
    </div>
  );
};

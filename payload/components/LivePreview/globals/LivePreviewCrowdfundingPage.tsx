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

  return (
    <div className='bg-crowdfunding-bg flex flex-col'>
      <CrowdfundingHero {...data} t={t} />
      <CrowdfundingVideo {...data} t={t} />
      <CrowdfundingAbout {...data} t={t} />
      <CrowdfundingTransparency {...data} t={t} />
      <CrowdfundingRewards {...data} t={t} />
      <CrowdfundingUpdates {...data} t={t} />
      <CrowdfundingBusiness {...data} t={t} />
      <CrowdfundingPartners {...data} t={t} />
      <CrowdfundingFAQ {...data} t={t} />
      <CrowdfundingCTA {...data} t={t} />
    </div>
  );
};

import type { GlobalConfig } from 'payload';

import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { getServerSideURL } from '@/payload/utilities/getURL';
import CrowdfundingSettingsPhasesTab from './tabs/phases';
import CrowdfundingSettingsGeneralTab from './tabs/general';
import CrowdfundingSettingsFundsTab from './tabs/funds';

export const CrowdfundingSettings: GlobalConfig = {
  slug: 'crowdfunding-settings',
  label: {
    pt: 'Configurações de Crowdfunding',
    en: 'Crowdfunding Settings',
  },
  admin: {
    description:
      'Configure the dynamic numbers, dates, images, and videos shown on the Crowdfunding page.',
    preview: (_, { locale }) => {
      const baseUrl = getServerSideURL();
      return `${baseUrl}/${locale}/preview/crowdfunding`;
    },
    livePreview: {
      url: ({ locale }) => {
        const baseUrl = getServerSideURL();

        return `${baseUrl}/${locale?.code}/preview/crowdfunding`;
      },
    },
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        CrowdfundingSettingsFundsTab,
        CrowdfundingSettingsGeneralTab,
        CrowdfundingSettingsPhasesTab,
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    max: 3,
  },
};

import type { GlobalConfig } from 'payload';
import { GROUP_LABELS } from '@/payload/constants';

import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { getServerSideURL } from '@/payload/utilities/getURL';
import CrowdfundingSettingsPhasesTab from './tabs/phases';
import CrowdfundingSettingsGeneralTab from './tabs/general';
import CrowdfundingSettingsFundsTab from './tabs/funds';
import CrowdfundingSettingsUpdatesTab from './tabs/updates';
import CrowdfundingSettingsRewardsTab from './tabs/rewards';
import { CrowdfundingSettingsSupportersTab } from './tabs/supporters';
import { authenticatedEditor } from '@/payload/access/authenticatedEditor';

export const CrowdfundingSettings: GlobalConfig = {
  slug: 'crowdfunding-settings',
  label: {
    pt: 'Configurações de Crowdfunding',
    en: 'Crowdfunding Settings',
  },
  admin: {
    group: GROUP_LABELS.crowdfunding,
    components: {
      elements: {
        beforeDocumentControls: [
          '@/payload/globals/CrowdfundingSettings/components/ShowCrowdfundingSettingsInfo',
        ],
      },
    },
    description: {
      en: 'Configure the dynamic numbers, dates, images, and videos shown on the Crowdfunding page.',
      pt: 'Configure os números dinâmicos, datas, imagens e vídeos mostrados na página de Crowdfunding.',
    },
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
    read: authenticatedEditor,
    update: authenticatedEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        CrowdfundingSettingsGeneralTab,
        CrowdfundingSettingsFundsTab,
        CrowdfundingSettingsSupportersTab,
        CrowdfundingSettingsRewardsTab,
        CrowdfundingSettingsUpdatesTab,
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

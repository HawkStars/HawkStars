import type { GlobalConfig } from 'payload';

import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';

export const CrowdfundingSettings: GlobalConfig = {
  slug: 'crowdfunding-settings',
  label: {
    pt: 'Configurações de Crowdfunding',
    en: 'Crowdfunding Settings',
  },
  admin: {
    description: 'Configure the dynamic numbers and dates shown on the Crowdfunding page.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'raisedAmount',
      type: 'number',
      label: {
        pt: 'Valor Angariado (€)',
        en: 'Raised Amount (€)',
      },
      admin: {
        description: 'Total amount raised so far, in euros.',
      },
      required: true,
      defaultValue: 0,
    },
    {
      name: 'campaignGoal',
      type: 'number',
      label: {
        pt: 'Meta da Campanha (€)',
        en: 'Campaign Goal (€)',
      },
      admin: {
        description: 'The fundraising target for the campaign phase, in euros.',
      },
      required: true,
      defaultValue: 100000,
    },
    {
      name: 'projectGoal',
      type: 'number',
      label: {
        pt: 'Meta Total do Projeto (€)',
        en: 'Total Project Goal (€)',
      },
      admin: {
        description: 'The full investment target for the project, in euros.',
      },
      required: true,
      defaultValue: 900000,
    },
    {
      name: 'lastUpdateDate',
      type: 'text',
      label: {
        pt: 'Data da Última Atualização',
        en: 'Last Update Date',
      },
      admin: {
        description: 'Displayed date of the last statistics update (e.g. "Março 2025").',
      },
      localized: true,
      required: false,
    },
    {
      name: 'weeklyIncrease',
      type: 'text',
      label: {
        pt: 'Aumento Semanal (texto)',
        en: 'Weekly Increase (text)',
      },
      admin: {
        description:
          'Short label shown next to the raised amount to indicate weekly growth (e.g. "+2.3% esta semana").',
      },
      localized: true,
      required: false,
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

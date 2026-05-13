import { Tab } from 'payload';

const CrowdfundingSettingsFundsTab: Tab = {
  label: { pt: 'Fundos', en: 'Funds' },
  description: {
    pt: 'Configure os fundos que apoiam o projeto, mostrados na seção de "Fundos que Apoiamos" da página de crowdfunding.',
    en: 'Configure the funds that support the project, shown in the "Funds We Support" section of the crowdfunding page.',
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
        width: '33%',
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
        width: '33%',
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
        width: '33%',
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
};

export default CrowdfundingSettingsFundsTab;

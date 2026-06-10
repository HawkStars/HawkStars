import { Tab } from 'payload';

const HawkProjectDisseminationFields: Tab = {
  name: 'dissemination',
  label: { en: 'Dissemination', pt: 'Disseminação' },
  admin: {
    description: {
      en: 'Dissemination links per country and official reports.',
      pt: 'Links de disseminação por país e relatórios oficiais.',
    },
  },
  fields: [
    {
      name: 'reports',
      label: { en: 'Reports', pt: 'Relatórios' },
      type: 'array',
      interfaceName: 'HawkProjectDisseminationReport',
      admin: {
        description: {
          en: 'Official reports (Salto, Project Report, etc.)',
          pt: 'Relatórios oficiais (Salto, Relatório do Projeto, etc.)',
        },
        initCollapsed: true,
        components: {
          RowLabel:
            '@/payload/collections/HawkProject/components/pageTab/DisseminationReportsRowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          label: { en: 'Report Label', pt: 'Rótulo do Relatório' },
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: {
              en: 'e.g. "Relatório Salto", "Project Report"',
              pt: 'ex: "Relatório Salto", "Project Report"',
            },
          },
        },
        {
          name: 'url',
          label: { en: 'Report URL', pt: 'URL do Relatório' },
          type: 'text',
          required: true,
        },
        {
          name: 'is_hawk_report',
          label: { en: 'Hawk Stars Report', pt: 'Relatório Hawk Stars' },
          type: 'checkbox',
          admin: {
            description: {
              en: 'Check if this is a report created by Hawk Stars (e.g. internal project report)',
              pt: 'Marque se este é um relatório criado pela Hawk Stars (ex: relatório interno do projeto)',
            },
          },
        },
      ],
    },
  ],
};

export default HawkProjectDisseminationFields;

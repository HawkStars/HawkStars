import { Tab } from 'payload';

const HawkProjectDisseminationFields: Tab = {
  name: 'dissemination',
  label: { en: 'Dissemination', pt: 'Disseminação' },
  admin: {
    description: 'Dissemination links per country and official reports.',
  },
  fields: [
    {
      name: 'reports',
      label: { en: 'Reports', pt: 'Relatórios' },
      type: 'array',
      interfaceName: 'HawkProjectDisseminationReport',
      admin: {
        description: 'Official reports (Salto, Project Report, etc.)',
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
          admin: { description: 'e.g. "Relatório Salto", "Project Report"' },
        },
        {
          name: 'url',
          label: { en: 'Report URL', pt: 'URL do Relatório' },
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};

export default HawkProjectDisseminationFields;

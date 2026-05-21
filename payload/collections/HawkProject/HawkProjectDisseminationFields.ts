import { Tab } from 'payload';

const HawkProjectDisseminationFields: Tab = {
  name: 'dissemination',
  label: 'Dissemination',
  admin: {
    description: 'Dissemination links per country and official reports.',
  },
  fields: [
    {
      name: 'reports',
      label: 'Reports',
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
          label: 'Report Label',
          type: 'text',
          required: true,
          localized: true,
          admin: { description: 'e.g. "Relatório Salto", "Project Report"' },
        },
        {
          name: 'url',
          label: 'Report URL',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};

export default HawkProjectDisseminationFields;

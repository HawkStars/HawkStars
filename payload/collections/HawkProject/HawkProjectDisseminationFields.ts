import { Tab } from 'payload';
import { PLATFORM_OPTIONS } from './config';

const HawkProjectDisseminationFields: Tab = {
  name: 'otherDisseminationFields',
  label: { en: 'Other Documents', pt: 'Outros Documentos' },
  admin: {
    description: {
      en: 'Dissemination links per other partners and official reports.',
      pt: 'Links de disseminação por outros parceiros e relatórios oficiais.',
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
          RowLabel: '@/payload/collections/HawkProject/components/partners/ReportsRowLabel',
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
          name: 'platform',
          label: { en: 'Platform', pt: 'Plataforma' },
          type: 'select',
          required: true,
          options: PLATFORM_OPTIONS,
          admin: {
            description: {
              en: 'Select the platform where the partner disseminated project results',
              pt: 'Selecione a plataforma onde o parceiro disseminou os resultados do projeto',
            },
          },
        },
      ],
    },
  ],
};

export default HawkProjectDisseminationFields;

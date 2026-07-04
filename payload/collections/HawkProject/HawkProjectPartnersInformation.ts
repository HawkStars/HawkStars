import { Tab } from 'payload';
import { PLATFORM_OPTIONS } from './config';

const HawkProjectPartnersInformation: Tab = {
  name: 'partnersInformation',
  label: { en: 'Partners', pt: 'Parceiros' },
  interfaceName: 'HawkProjectPartnersInformation',
  admin: {
    description: {
      en: 'Information about the project’s partners, including their names, roles, and contributions.',
      pt: 'Informação sobre os parceiros do projeto, incluindo nomes, funções e contribuições.',
    },
  },
  fields: [
    {
      name: 'partners',
      label: { en: 'Partner Information', pt: 'Informação do Parceiro' },
      type: 'array',
      interfaceName: 'HawkProjectPartnerInformation',
      admin: {
        description: {
          en: 'List of partner organizations involved in the project',
          pt: 'Lista de organizações parceiras envolvidas no projeto',
        },
        initCollapsed: true,
        components: {
          RowLabel: '@/payload/collections/HawkProject/components/partners/PartnersRowLabel',
        },
      },
      fields: [
        {
          name: 'partner',
          label: { en: 'Partners', pt: 'Parceiros' },
          type: 'relationship',
          relationTo: 'partners',
          filterOptions: {
            partnership: { equals: 'erasmus_partner' },
          },
          required: true,
          admin: {
            description: {
              en: 'Select partner organisations for this project. They will be grouped by country automatically.',
              pt: 'Selecione as organizações parceiras para este projeto. Serão agrupadas por país automaticamente.',
            },
          },
        },
        {
          name: 'role',
          label: { en: 'Role', pt: 'Papel' },
          type: 'select',
          options: [
            {
              label: { en: 'Hosting organisation', pt: 'Organização de Acolhimento' },
              value: 'hosting_org',
            },
            {
              label: { en: 'Sending organisation', pt: 'Organização de Envio' },
              value: 'sending_org',
            },
            {
              label: { en: 'Supporting organisation', pt: 'Organização de Apoio' },
              value: 'supporting_org',
            },
          ],
          admin: {
            description: {
              en: 'Select the role of the partner organisation in this project',
              pt: 'Selecione o papel da organização parceira neste projeto',
            },
          },
          defaultValue: 'sending_org',
        },
        {
          name: 'reports',
          label: { en: 'Official Reports', pt: 'Relatórios Oficiais' },
          type: 'array',
          interfaceName: 'HawkProjectPartnerReport',
          admin: {
            description: {
              en: 'Official reports related to this partner (Salto, Project Report, etc.)',
              pt: 'Relatórios oficiais relacionados com este parceiro (Salto, Relatório do Projeto, etc.)',
            },
            initCollapsed: true,
            components: {
              RowLabel: '@/payload/collections/HawkProject/components/partners/ReportsRowLabel',
            },
          },
          fields: [
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
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              required: true,
              admin: {
                description: {
                  en: 'Link to the partner’s report or dissemination page',
                  pt: 'Link para o relatório ou página de disseminação do parceiro',
                },
              },
            },
            {
              name: 'label',
              label: { en: 'Button Label', pt: 'Rótulo do Botão' },
              type: 'text',
              localized: true,
              admin: {
                description: {
                  en: 'e.g. "Disseminação via Facebook" — if empty, auto-generated from platform',
                  pt: 'ex: "Disseminação via Facebook" — se vazio, gerado automaticamente a partir da plataforma',
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

export default HawkProjectPartnersInformation;

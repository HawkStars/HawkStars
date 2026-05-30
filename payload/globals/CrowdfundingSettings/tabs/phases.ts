import { Tab } from 'payload';

const CrowdfundingSettingsPhasesTab: Tab = {
  label: { pt: 'Fases da Campanha', en: 'Campaign Phases' },
  description: {
    pt: 'Configure as fases da campanha de crowdfunding, que aparecem na seção de linha do tempo da página de crowdfunding.',
    en: 'Configure the phases of the crowdfunding campaign, which appear in the timeline section of the crowdfunding page.',
  },
  fields: [
    {
      name: 'phases',
      type: 'array',
      admin: {
        description: {
          en: 'Campaign phases shown in the timeline section. Add one per phase, in order.',
          pt: 'Fases da campanha mostradas na secção da linha do tempo. Adicione uma por fase, por ordem.',
        },
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      label: { pt: 'Fases da Campanha', en: 'Campaign Phases' },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: { pt: 'Título da Fase', en: 'Phase Title' },
          required: true,
          localized: true,
          admin: {
            description: {
              en: 'E.g. "Fase 1: Campanha de Angariação de Fundos".',
              pt: 'Ex: "Fase 1: Campanha de Angariação de Fundos".',
            },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: { pt: 'Descrição da Fase', en: 'Phase Description' },
          required: false,
          localized: true,
          admin: {
            description: {
              en: 'Short description of the phase, shown in the timeline section (e.g. "Março 2024 - Dezembro 2024").',
              pt: 'Descrição curta da fase, mostrada na secção da linha do tempo (ex: "Março 2024 - Dezembro 2024").',
            },
          },
        },
        {
          name: 'completed',
          type: 'checkbox',
          label: { pt: 'Fase Completa?', en: 'Phase Completed?' },
          required: true,
          defaultValue: false,
        },
      ],
    },
  ],
};

export default CrowdfundingSettingsPhasesTab;

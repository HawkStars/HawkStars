import { PayloadImageField } from '@/payload/fields/ImageType';
import { MultiImageField } from '@/payload/fields/MultiImage';
import { Tab } from 'payload';

/* ================================================================== */
/*  PROJECT PAGE TAB — Structured fields so every project page        */
/*  renders with the same layout as the AI4You(th) sample.            */
/* ================================================================== */
const HawkProjectPageTab: Tab = {
  label: {
    en: 'Project Page',
    pt: 'Página do Projeto',
  },
  description: 'Structured content for the public project page',
  fields: [
    {
      name: 'heading',
      label: { en: 'Full Project Name', pt: 'Nome Completo do Projeto' },
      type: 'text',
      localized: true,
      admin: {
        description: 'e.g. AI4YOU(th) – AI IN EVERYDAY LIFE',
      },
    },

    PayloadImageField({
      name: 'coverImage',
      label: 'Imagem de Capa',
      description: 'Main image shown at the top of the project page',
    }),

    /* -------------------------------------------------------------- */
    /*  1. HERO SECTION                                               */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'hero',
      label: { en: 'Hero Section', pt: 'Secção Hero' },
      admin: {
        description:
          'Top area of the project page: badge, stats, video, metadata, and country flags.',
      },
      fields: [
        /* Project badge / icon (e.g. "Youth Exchange" logo) */
        PayloadImageField({
          name: 'projectBadge',
          label: 'Distintivo / Ícone do Projeto',
          description: 'Small badge image shown above the title (e.g. Youth Exchange logo)',
          hideGutter: true,
        }),

        /* Key stats row */
        {
          type: 'row',
          fields: [
            {
              name: 'participants',
              label: { en: 'Participants', pt: 'Participantes' },
              type: 'number',
              admin: {
                description: 'Number of participants (e.g. 36)',
                width: '25%',
              },
            },
            {
              name: 'fundedAmount',
              label: { en: 'Funded Amount', pt: 'Montante Financiado' },
              type: 'number',
              admin: {
                description: 'Total funded amount (e.g. 38064)',
                width: '25%',
              },
            },
            /* Video embed */
            {
              name: 'videoUrl',
              label: { en: 'Video URL', pt: 'URL do Vídeo' },
              type: 'text',
              admin: {
                description: 'YouTube or other embed URL shown in the hero section',
                width: '50%',
              },
              required: false,
              validate: (value: string | undefined | null) => {
                if (value) {
                  if (value.includes('youtube.com') || value.includes('youtu.be')) {
                    if (value.includes('embed') || value.includes('watch?v=')) {
                      return true;
                    }
                    return "Please provide a valid YouTube URL (must contain 'embed' or 'watch?v=')";
                  }

                  return true;
                }

                return true;
              },
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  2. DESCRIPTION SECTION                                        */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'details',
      label: { en: 'Description', pt: 'Descrição' },
      admin: {
        description: 'Main description block shown below the hero section.',
      },
      fields: [
        {
          name: 'text',
          label: { en: 'Description Text', pt: 'Texto de Descrição' },
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Main paragraph describing the project',
            rows: 6,
          },
        },
        {
          name: 'phases',
          label: { en: 'Phases / Key Points', pt: 'Fases / Pontos Chave' },
          type: 'array',
          interfaceName: 'HawkProjectPagePhase',
          admin: {
            description: 'Bullet points for educational phases or key points',
            initCollapsed: true,
            components: {
              RowLabel: '@/payload/collections/HawkProject/components/pageTab/PhasesRowLabel',
            },
          },
          fields: [
            {
              name: 'title',
              label: { en: 'Phase Title', pt: 'Título da Fase' },
              type: 'text',
              localized: true,
              admin: { description: 'e.g. "Integração do grupo"' },
            },
            {
              name: 'description',
              label: { en: 'Phase Description', pt: 'Descrição da Fase' },
              type: 'textarea',
              localized: true,
              admin: {
                description: 'e.g. "dinâmicas de teambuilding, criação de um contrato social..."',
              },
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  4. OBJECTIVES SECTION                                         */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'objectives',
      label: { en: 'Objectives', pt: 'Objetivos' },
      admin: {
        description: 'Project objectives section with an intro paragraph and bullet items.',
      },
      fields: [
        {
          name: 'introduction',
          label: { en: 'Introduction', pt: 'Introdução' },
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Introductory paragraph before the objectives list',
            rows: 4,
          },
        },
        {
          name: 'items',
          label: { en: 'Objective Items', pt: 'Itens de Objetivo' },
          type: 'array',
          interfaceName: 'HawkProjectObjectiveItem',
          admin: {
            initCollapsed: true,
            components: {
              RowLabel:
                '@/payload/collections/HawkProject/components/pageTab/ObjectiveItemsRowLabel',
            },
          },
          fields: [
            {
              name: 'text',
              label: { en: 'Objective', pt: 'Objetivo' },
              type: 'textarea',
              localized: true,
              required: true,
            },
          ],
        },
        PayloadImageField({
          name: 'objectivesImage',
          label: 'Imagem dos Objetivos',
          description: 'Image displayed on the end of the objectives text',
        }),
      ],
    },

    /* -------------------------------------------------------------- */
    /*  5. RESULTS SECTION                                            */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'results',
      label: { en: 'Results', pt: 'Resultados' },
      admin: {
        description: 'Project results — text on the left, image on the right.',
      },
      fields: [
        {
          name: 'text',
          label: { en: 'Results Text', pt: 'Texto dos Resultados' },
          type: 'textarea',
          localized: true,
          admin: { rows: 6 },
        },
        PayloadImageField({
          name: 'resultsImage',
          label: 'Imagem dos Resultados',
          description: 'Image displayed alongside the results text',
        }),
      ],
    },

    /* -------------------------------------------------------------- */
    /*  6. PHOTO GALLERY                                              */
    /* -------------------------------------------------------------- */
    MultiImageField({
      name: 'gallery',
      label: 'Galeria de Fotos',
      description: 'Photos displayed at the bottom of the project page',
    }),
  ],
};

export default HawkProjectPageTab;

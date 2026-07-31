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
  description: {
    en: 'Structured content for the public project page',
    pt: 'Conteúdo estruturado para a página pública do projeto',
  },
  fields: [
    {
      name: 'heading',
      label: { en: 'Full Project Name', pt: 'Nome Completo do Projeto' },
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: 'e.g. AI4YOU(th) – AI IN EVERYDAY LIFE',
          pt: 'ex: AI4YOU(th) – AI NO DIA-A-DIA',
        },
      },
    },

    PayloadImageField({
      name: 'coverImage',
      label: 'Imagem de Capa',
      description: {
        en: 'Main image shown at the top of the project page',
        pt: 'Imagem principal mostrada no topo da página do projeto',
      },
    }),

    /* -------------------------------------------------------------- */
    /*  1. HERO SECTION                                               */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'hero',
      label: { en: 'Hero Section', pt: 'Secção Hero' },
      admin: {
        description: {
          en: 'Top area of the project page: badge, stats, video, metadata, and country flags.',
          pt: 'Área de topo da página do projeto: distintivo, estatísticas, vídeo, metadados e bandeiras de países.',
        },
      },
      fields: [
        /* Project badge / icon (e.g. "Youth Exchange" logo) */
        PayloadImageField({
          name: 'projectBadge',
          label: 'Distintivo / Ícone do Projeto',
          description: {
            en: 'Small badge image shown above the title (e.g. Youth Exchange logo)',
            pt: 'Imagem de distintivo pequeno mostrada acima do título (ex: logótipo Youth Exchange)',
          },
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
                description: {
                  en: 'Number of participants (e.g. 36)',
                  pt: 'Número de participantes (ex: 36)',
                },
                width: '25%',
              },
            },
            {
              name: 'fundedAmount',
              label: { en: 'Funded Amount', pt: 'Montante Financiado' },
              type: 'number',
              admin: {
                description: {
                  en: 'Total funded amount (e.g. 38064)',
                  pt: 'Montante total financiado (ex: 38064)',
                },
                width: '25%',
              },
            },
            /* Video embed */
            {
              name: 'videoUrl',
              label: { en: 'Video URL', pt: 'URL do Vídeo' },
              type: 'text',
              admin: {
                description: {
                  en: 'YouTube or other embed URL shown in the hero section',
                  pt: 'URL de incorporação do YouTube ou outro mostrado na secção hero',
                },
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
        description: {
          en: 'Main description block shown below the hero section.',
          pt: 'Bloco de descrição principal mostrado abaixo da secção hero.',
        },
      },
      fields: [
        {
          name: 'text',
          label: { en: 'Description Text', pt: 'Texto de Descrição' },
          type: 'textarea',
          localized: true,
          admin: {
            description: {
              en: 'Main paragraph describing the project',
              pt: 'Parágrafo principal a descrever o projeto',
            },
            rows: 6,
          },
        },
        {
          name: 'phases',
          label: { en: 'Phases / Key Points', pt: 'Fases / Pontos Chave' },
          type: 'array',
          interfaceName: 'HawkProjectPagePhase',
          admin: {
            description: {
              en: 'Bullet points for educational phases or key points',
              pt: 'Pontos para fases educativas ou pontos-chave',
            },
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
              admin: {
                description: { en: 'e.g. "Integração do grupo"', pt: 'ex: "Integração do grupo"' },
              },
            },
            {
              name: 'description',
              label: { en: 'Phase Description', pt: 'Descrição da Fase' },
              type: 'textarea',
              localized: true,
              admin: {
                description: {
                  en: 'e.g. "dinâmicas de teambuilding, criação de um contrato social..."',
                  pt: 'ex: "dinâmicas de teambuilding, criação de um contrato social..."',
                },
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
        description: {
          en: 'Project objectives section with an intro paragraph and bullet items.',
          pt: 'Secção de objetivos do projeto com parágrafo introdutório e itens.',
        },
      },
      fields: [
        {
          name: 'introduction',
          label: { en: 'Introduction', pt: 'Introdução' },
          type: 'textarea',
          localized: true,
          admin: {
            description: {
              en: 'Introductory paragraph before the objectives list',
              pt: 'Parágrafo introdutório antes da lista de objetivos',
            },
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
          description: {
            en: 'Image displayed on the end of the objectives text',
            pt: 'Imagem exibida no final do texto dos objetivos',
          },
          hideGutter: true,
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
        description: {
          en: 'Project results — text on the left, image on the right.',
          pt: 'Resultados do projeto — texto à esquerda, imagem à direita.',
        },
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
          description: {
            en: 'Image displayed alongside the results text',
            pt: 'Imagem exibida ao lado do texto dos resultados',
          },
          hideGutter: true,
        }),
      ],
    },

    /* -------------------------------------------------------------- */
    /*  6. PHOTO GALLERY                                              */
    /* -------------------------------------------------------------- */
    MultiImageField({
      name: 'gallery',
      label: 'Galeria de Fotos',
      description: {
        en: 'Photos displayed at the bottom of the project page',
        pt: 'Fotos exibidas no fundo da página do projeto',
      },
    }),
  ],
};

export default HawkProjectPageTab;

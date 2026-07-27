import { PayloadImageField } from '@/payload/fields/ImageType';
import { MultiImageField } from '@/payload/fields/MultiImage';
import { Tab } from 'payload';

const HawkEventDetails: Tab = {
  label: { en: 'Details', pt: 'Detalhes' },
  description: { en: 'Information about the Hawk Event', pt: 'Informação sobre o Evento Hawk' },
  admin: {
    description: {
      en: 'Configure the details for the Hawk Event here',
      pt: 'Configure aqui os detalhes do Evento Hawk',
    },
  },
  fields: [
    {
      name: 'heading',
      label: { en: 'Title', pt: 'Título' },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subheading',
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      type: 'text',
      localized: true,
    },
    {
      label: { en: 'General Information', pt: 'Informação Geral' },
      type: 'group',
      fields: [
        {
          name: 'description',
          label: { en: 'Description', pt: 'Descrição' },
          type: 'textarea',
          localized: true,
          admin: {
            description: {
              en: 'Short description shown on the homepage top',
              pt: 'Descrição curta mostrada no topo da página inicial',
            },
          },
        },
        {
          name: 'isDateRange',
          label: { en: 'Multi-day Event', pt: 'Evento de Vários Dias' },
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: {
              en: 'Enable if the event spans more than one day',
              pt: 'Ative se o evento durar mais do que um dia',
            },
          },
        },
        {
          name: 'date',
          label: { en: 'Event Date / Start Date', pt: 'Data do Evento / Data de Início' },
          type: 'date',
          required: true,
          admin: {
            description: {
              en: 'Event date, or the first day for multi-day events',
              pt: 'Data do evento, ou o primeiro dia para eventos de vários dias',
            },
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'endDate',
          label: { en: 'End Date', pt: 'Data de Fim' },
          type: 'date',
          admin: {
            description: {
              en: 'Last day of the event (only for multi-day events)',
              pt: 'Último dia do evento (apenas para eventos de vários dias)',
            },
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
            condition: (_, siblingData) => Boolean(siblingData?.isDateRange),
          },
        },
      ],
    },

    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      required: true,
      hooks: {
        beforeChange: [({ data }) => data?.heading?.replace(/\s+/g, '-').toLowerCase()],
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type_event',
      label: { en: 'Type of Event', pt: 'Tipo de Evento' },
      type: 'select',
      defaultValue: 'local_event',
      options: [
        { label: { en: 'Local Event', pt: 'Evento Local' }, value: 'local_event' },
        {
          label: { en: 'International Event', pt: 'Evento Internacional' },
          value: 'international_event',
        },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
      ],
    },
    /* -------------------------------------------------------------- */
    /*  PAGE CONTENT — structured fields replacing rich text          */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'details',
      label: { en: 'Description', pt: 'Descrição' },
      admin: {
        description: {
          en: 'Main body content shown on the public event page.',
          pt: 'Conteúdo principal mostrado na página pública do evento.',
        },
      },
      fields: [
        {
          name: 'text',
          label: { en: 'Main Text', pt: 'Texto Principal' },
          type: 'textarea',
          localized: true,
          admin: {
            description: {
              en: 'Main paragraph describing the event in detail',
              pt: 'Parágrafo principal a descrever o evento em detalhe',
            },
            rows: 8,
          },
        },
        {
          name: 'sections',
          label: { en: 'Additional Sections', pt: 'Secções Adicionais' },
          type: 'array',
          interfaceName: 'HawkEventSection',
          admin: {
            description: {
              en: 'Titled sections for extra content (e.g. "Activities", "Outcomes")',
              pt: 'Secções com título para conteúdo extra (ex: "Atividades", "Resultados")',
            },
            initCollapsed: true,
          },
          fields: [
            {
              name: 'title',
              label: { en: 'Section Title', pt: 'Título da Secção' },
              type: 'text',
              localized: true,
            },
            {
              name: 'text',
              label: { en: 'Section Text', pt: 'Texto da Secção' },
              type: 'textarea',
              localized: true,
              admin: { rows: 6 },
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  PROGRAM / SCHEDULE                                            */
    /* -------------------------------------------------------------- */
    {
      name: 'program',
      label: { en: 'Program / Schedule', pt: 'Programa / Horário' },
      type: 'array',
      interfaceName: 'HawkEventProgramItem',
      admin: {
        description: {
          en: 'Day-by-day or session-by-session schedule of the event',
          pt: 'Programa do evento dia a dia ou sessão a sessão',
        },
        initCollapsed: true,
      },
      fields: [
        {
          name: 'day',
          label: { en: 'Day / Time', pt: 'Dia / Hora' },
          type: 'text',
          localized: false,
          admin: {
            description: { en: 'e.g. "Day 1", "09:00-10:30"', pt: 'ex: "Dia 1", "09:00-10:30"' },
            width: '30%',
          },
        },
        {
          name: 'title',
          label: { en: 'Activity Title', pt: 'Título da Atividade' },
          type: 'text',
          localized: true,
          admin: { width: '70%' },
        },
        {
          name: 'description',
          label: { en: 'Activity Description', pt: 'Descrição da Atividade' },
          type: 'textarea',
          localized: true,
          admin: { rows: 3 },
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  OBJECTIVES                                                    */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'objectives',
      label: { en: 'Objectives', pt: 'Objetivos' },
      admin: {
        description: {
          en: 'List of goals or learning outcomes for the event.',
          pt: 'Lista de objetivos ou resultados de aprendizagem do evento.',
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
              en: 'Short introductory paragraph before the objectives list',
              pt: 'Parágrafo introdutório curto antes da lista de objetivos',
            },
            rows: 4,
          },
        },
        {
          name: 'items',
          label: { en: 'Objective Items', pt: 'Itens de Objetivo' },
          type: 'array',
          interfaceName: 'HawkEventObjectiveItem',
          admin: { initCollapsed: true },
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
      ],
    },

    /* -------------------------------------------------------------- */
    /*  PHOTO GALLERY                                                 */
    /* -------------------------------------------------------------- */
    MultiImageField({
      name: 'gallery',
      label: 'Galeria de Fotos',
      description: {
        en: 'Photos displayed at the bottom of the event page',
        pt: 'Fotos exibidas no fundo da página do evento',
      },
    }),

    PayloadImageField({
      label: 'Imagem',
      name: 'image',
      required: true,
      description: {
        en: 'Image representing the event on the events main page not on the event page itself',
        pt: 'Imagem que representa o evento na página principal de eventos, não na página do próprio evento',
      },
    }),
    {
      name: 'instagram',
      label: { en: 'Instagram Post URL', pt: 'URL da Publicação do Instagram' },
      type: 'text',
      admin: {
        description: {
          en: 'The full URL of the Instagram post',
          pt: 'O URL completo da publicação do Instagram',
        },
      },
    },
  ],
};

export default HawkEventDetails;

import { PayloadImageField } from '@/payload/fields/ImageType';
import { MultiImageField } from '@/payload/fields/MultiImage';
import { Tab } from 'payload';

const HawkEventDetails: Tab = {
  label: { en: 'Details', pt: 'Detalhes' },
  description: 'Information about the Hawk Event',
  admin: {
    description: 'Configure the details for the Hawk Event here',
  },
  fields: [
    { name: 'heading', label: { en: 'Title', pt: 'Título' }, type: 'text', required: true, localized: true },
    { name: 'subheading', label: { en: 'Subtitle', pt: 'Subtítulo' }, type: 'text', localized: true },
    {
      label: { en: 'General Information', pt: 'Informação Geral' },
      type: 'group',
      fields: [
        {
          name: 'description',
          label: { en: 'Description', pt: 'Descrição' },
          type: 'textarea',
          localized: true,
          admin: { description: 'Short description shown on the homepage top' },
        },
        {
          name: 'isDateRange',
          label: { en: 'Multi-day Event', pt: 'Evento de Vários Dias' },
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable if the event spans more than one day',
          },
        },
        {
          name: 'date',
          label: { en: 'Event Date / Start Date', pt: 'Data do Evento / Data de Início' },
          type: 'date',
          required: true,
          admin: {
            description: 'Event date, or the first day for multi-day events',
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
            description: 'Last day of the event (only for multi-day events)',
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
      name: 'status',
      label: { en: 'Status', pt: 'Estado' },
      type: 'select',
      options: [
        { label: { en: 'Draft', pt: 'Rascunho' }, value: 'draft' },
        { label: { en: 'Published', pt: 'Publicado' }, value: 'published' },
        { label: { en: 'Archived', pt: 'Arquivado' }, value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },

    {
      name: 'type_event',
      label: { en: 'Type of Event', pt: 'Tipo de Evento' },
      type: 'select',
      defaultValue: 'local_event',
      options: [
        { label: { en: 'Local Event', pt: 'Evento Local' }, value: 'local_event' },
        { label: { en: 'International Event', pt: 'Evento Internacional' }, value: 'international_event' },
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
        description: 'Main body content shown on the public event page.',
      },
      fields: [
        {
          name: 'text',
          label: { en: 'Main Text', pt: 'Texto Principal' },
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Main paragraph describing the event in detail',
            rows: 8,
          },
        },
        {
          name: 'sections',
          label: { en: 'Additional Sections', pt: 'Secções Adicionais' },
          type: 'array',
          interfaceName: 'HawkEventSection',
          admin: {
            description: 'Titled sections for extra content (e.g. "Activities", "Outcomes")',
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
        description: 'Day-by-day or session-by-session schedule of the event',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'day',
          label: { en: 'Day / Time', pt: 'Dia / Hora' },
          type: 'text',
          localized: false,
          admin: { description: 'e.g. "Day 1", "09:00-10:30"', width: '30%' },
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
        description: 'List of goals or learning outcomes for the event.',
      },
      fields: [
        {
          name: 'introduction',
          label: { en: 'Introduction', pt: 'Introdução' },
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Short introductory paragraph before the objectives list',
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
      description: 'Photos displayed at the bottom of the event page',
    }),

    PayloadImageField({
      label: 'Imagem',
      name: 'image',
      required: true,
      description:
        'Image representing the event on the events main page not on the event page itself',
    }),
    {
      name: 'instagram',
      label: { en: 'Instagram Post URL', pt: 'URL da Publicação do Instagram' },
      type: 'text',
      admin: { description: 'The full URL of the Instagram post' },
    },
  ],
};

export default HawkEventDetails;

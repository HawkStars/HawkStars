import type { CollectionConfig } from 'payload';
import { authenticatedAdmin } from '../../access/authenticatedAdmin';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';
import { authenticated } from '../../access/authenticated';
import HawkProjectPageTab from './HawkProjectPageTab';
import { sanitizeBrokenImageRelationship } from '../../hooks/sanitizeBrokenImageRelationship';
import HawkProjectPartnersInformation from './HawkProjectPartnersInformation';
import { getServerSideURL } from '@/payload/utilities/getURL';
import HawkProjectDisseminationFields from './HawkProjectDisseminationFields';
import { GROUP_LABELS } from '@/payload/constants';
import HawkStarsProjectInformation from './HawkStarsProjectInformation';
import transformSlug from '@/payload/utilities/transformSlug';
import { notifyProjectChange, notifyProjectDelete } from './hooks';
import { HawkProjectDiscoverEuFields } from './HawkProjectDiscoverEuFields';
import { createRevalidateHooks } from '@/payload/utilities/revalidateCollection';

export const HAWK_PROJECT_CACHE_TAG = 'hawk_projects' as const;
const { afterChange: revalidateHawkProject, afterDelete: revalidateHawkProjectDelete } =
  createRevalidateHooks(HAWK_PROJECT_CACHE_TAG);

export const HawkProject: CollectionConfig = {
  slug: 'hawk_projects',
  labels: {
    singular: {
      en: 'Hawk Project',
      pt: 'Projeto Erasmus da Hawk',
    },
    plural: {
      en: 'Hawk Projects',
      pt: 'Projetos Erasmus da Hawk',
    },
  },
  admin: {
    useAsTitle: 'heading',
    defaultColumns: ['heading', 'slug', 'startDate'],
    description: {
      en: 'Manage HawkStars projects and events. Add project details, images, and descriptions. Each project gets its own public page based on its slug.',
      pt: 'Gira os projetos e eventos da HawkStars. Adicione detalhes, imagens e descrições. Cada projeto tem a sua própria página pública baseada no slug.',
    },
    group: {
      ...GROUP_LABELS.erasmus,
    },
    components: {},
    preview: (doc, { locale }) => {
      const baseUrl = getServerSideURL();
      return `${baseUrl}/${locale}/projects/${doc.slug}`;
    },
    livePreview: {
      url: ({ locale, data }) => {
        const baseUrl = getServerSideURL();
        const lang = locale?.code || 'pt';

        return `${baseUrl}/${lang}/preview/projects/${data.slug}`;
      },
    },
  },
  defaultPopulate: {
    slug: true,
  },
  access: {
    admin: authenticated,
    read: authenticatedOrPublished,
    create: authenticated,
    delete: authenticatedAdmin,
    update: authenticated,
  },
  hooks: {
    afterChange: [notifyProjectChange, revalidateHawkProject],
    afterDelete: [notifyProjectDelete, revalidateHawkProjectDelete],
    afterRead: [sanitizeBrokenImageRelationship],
  },
  fields: [
    {
      type: 'tabs',
      label: 'Hawk Project Details',
      tabs: [
        HawkProjectPageTab,
        HawkProjectPartnersInformation,
        HawkProjectDisseminationFields,
        HawkStarsProjectInformation,
        HawkProjectDiscoverEuFields,
      ],
    },
    /* -------------------------------------------------------------- */
    /*  ADMIN SECTION                                                 */
    /* -------------------------------------------------------------- */
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      admin: {
        description: {
          en: 'Unique slug used in the project page URL (e.g. "ai4youth"). Auto-generated from the title if left empty.',
          pt: 'Slug único usado no URL da página do projeto (ex: "ai4youth"). Gerado automaticamente a partir do título se ficar vazio.',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            const slug = data?.slug;
            if (!slug) return '';

            const transformedSlug = transformSlug(data.slug);
            return transformedSlug;
          },
        ],
      },
    },
    {
      name: 'actionType',
      label: { en: 'Action Type', pt: 'Tipo de Ação' },
      type: 'text',
      admin: {
        description: {
          en: 'e.g. KA152-YOU - Mobility of young people',
          pt: 'ex: KA152-YOU - Mobilidade de jovens',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'referenceNumber',
      label: { en: 'Reference Number', pt: 'Número de Referência' },
      type: 'text',
      admin: {
        description: {
          en: 'e.g. 2024-1-PT02-KA152-YOU-000232143',
          pt: 'ex: 2024-1-PT02-KA152-YOU-000232143',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'beneficiary',
      label: { en: 'Beneficiary', pt: 'Beneficiário' },
      type: 'text',
      admin: {
        description: { en: 'e.g. Hawk Stars (Portugal)', pt: 'ex: Hawk Stars (Portugal)' },
        position: 'sidebar',
      },
    },
    {
      name: 'location',
      label: { en: 'Location', pt: 'Localização' },
      type: 'text',
      localized: false,
      admin: {
        description: { en: 'e.g. Pinhel, Portugal', pt: 'ex: Pinhel, Portugal' },
        position: 'sidebar',
      },
    },
    {
      name: 'startDate',
      // Filtered and/or sorted on by the public list queries; an unindexed sort
      // on a growing collection uses Mongo's blocking sort, which hard-errors at 32MB.
      index: true,
      label: { en: 'Activity start date', pt: 'Data de início da atividade' },
      type: 'date',
      admin: {
        position: 'sidebar',
        description: {
          en: 'First day of the activity itself — the period with participants (e.g. the exchange or training week). Not the full project; use "Project duration" below for that.',
          pt: 'Primeiro dia da atividade em si — o período com participantes (ex: a semana do intercâmbio ou da formação). Não é o projeto completo; para isso use "Duração do projeto" abaixo.',
        },
      },
      required: false,
    },
    {
      name: 'endDate',
      // Filtered and/or sorted on by the public list queries; an unindexed sort
      // on a growing collection uses Mongo's blocking sort, which hard-errors at 32MB.
      index: true,
      label: { en: 'Activity end date', pt: 'Data de fim da atividade' },
      type: 'date',
      admin: {
        position: 'sidebar',
        description: {
          en: 'Last day of the activity with participants. Leave empty if the activity is a single day.',
          pt: 'Último dia da atividade com participantes. Deixe vazio se a atividade for de um único dia.',
        },
      },
      required: false,
    },
    {
      name: 'projectStartDate',
      label: { en: 'Project duration — start', pt: 'Duração do projeto — início' },
      type: 'date',
      required: false,
      admin: {
        position: 'sidebar',
        description: {
          en: 'Start of the whole project, including preparation and pre-work before the activity. Optional.',
          pt: 'Início do projeto completo, incluindo a preparação e o trabalho prévio antes da atividade. Opcional.',
        },
      },
    },
    {
      name: 'projectEndDate',
      label: { en: 'Project duration — end', pt: 'Duração do projeto — fim' },
      type: 'date',
      required: false,
      admin: {
        position: 'sidebar',
        description: {
          en: 'End of the whole project, including follow-up and dissemination after the activity. Optional.',
          pt: 'Fim do projeto completo, incluindo o acompanhamento e a disseminação depois da atividade. Opcional.',
        },
      },
      validate: (value, { siblingData, req }) => {
        const start = (siblingData as { projectStartDate?: string | null }).projectStartDate;
        if (!value || !start || new Date(value) >= new Date(start)) return true;
        return req.i18n?.language === 'pt'
          ? 'O fim do projeto tem de ser igual ou posterior ao início do projeto.'
          : 'The project end date must be on or after the project start date.';
      },
    },
    {
      name: 'infopack',
      label: { en: 'Infopack', pt: 'Infopack' },
      type: 'upload',
      relationTo: 'documents',
      required: false,
      admin: {
        position: 'sidebar',
        description: {
          en: 'Optional infopack document related to the project.',
          pt: 'Infopack opcional relacionado ao projeto.',
        },
      },
    },
    {
      name: 'project_type',
      // Filtered and/or sorted on by the public list queries; an unindexed sort
      // on a growing collection uses Mongo's blocking sort, which hard-errors at 32MB.
      index: true,
      label: { en: 'Project Type', pt: 'Tipo de Projeto' },
      type: 'select',
      options: [
        { label: { en: 'Youth Exchange', pt: 'Intercâmbio de Jovens' }, value: 'youth_exchange' },
        { label: { en: 'Training Course', pt: 'Curso de Formação' }, value: 'training_course' },
        { label: { en: 'Seminar', pt: 'Seminário' }, value: 'seminar' },
        { label: { en: 'Partnership', pt: 'Parceria' }, value: 'partnership' },
        { label: { en: 'DiscoverEU', pt: 'DiscoverEU' }, value: 'discover_eu' },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
      ],
      required: true,
      defaultValue: 'other',
      admin: {
        position: 'sidebar',
        description: {
          en: 'Select the type of project.',
          pt: 'Selecione o tipo de projeto.',
        },
      },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        // 100ms meant ~10 version writes and ~10 site-wide cache invalidations per
        // second while an editor typed. 2000 is Payload's own default.
        interval: 2000,
      },
      schedulePublish: true,
    },
    maxPerDoc: 5,
  },
};

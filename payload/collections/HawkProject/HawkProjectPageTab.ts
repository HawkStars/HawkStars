import { PayloadImageField } from '@/payload/fields/ImageType';
import { MultiImageField } from '@/payload/fields/MultiImage';
import { Tab } from 'payload';
import HawkProjectDisseminationFields from './HawkProjectDisseminationFields';

/* ================================================================== */
/*  PROJECT PAGE TAB — Structured fields so every project page        */
/*  renders with the same layout as the AI4You(th) sample.            */
/* ================================================================== */
const HawkProjectPageTab: Tab = {
  label: 'Project Page',
  description: 'Structured content for the public project page',
  fields: [
    {
      name: 'heading',
      label: 'Full Project Name',
      type: 'text',
      localized: true,
      admin: {
        description: 'e.g. AI4YOU(th) – AI IN EVERYDAY LIFE',
      },
    },

    PayloadImageField({
      name: 'coverImage',
      label: 'Cover Image',
      description: 'Main image shown at the top of the project page',
    }),

    /* -------------------------------------------------------------- */
    /*  1. HERO SECTION                                               */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'hero',
      label: 'Hero Section',
      admin: {
        description:
          'Top area of the project page: badge, stats, video, metadata, and country flags.',
      },
      fields: [
        /* Project badge / icon (e.g. "Youth Exchange" logo) */
        PayloadImageField({
          name: 'projectBadge',
          label: 'Project Badge / Icon',
          description: 'Small badge image shown above the title (e.g. Youth Exchange logo)',
          hideGutter: true,
        }),

        /* Key stats row */
        {
          type: 'row',
          fields: [
            {
              name: 'participants',
              label: 'Participants',
              type: 'number',
              admin: {
                description: 'Number of participants (e.g. 36)',
                width: '25%',
              },
            },
            {
              name: 'fundedAmount',
              label: 'Funded Amount',
              type: 'number',
              admin: {
                description: 'Total funded amount (e.g. 38064)',
                width: '25%',
              },
            },
            /* Video embed */
            {
              name: 'videoUrl',
              label: 'Video URL',
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

                return 'Missing Link Url';
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
      label: 'Description',
      admin: {
        description: 'Main description block shown below the hero section.',
      },
      fields: [
        {
          name: 'text',
          label: 'Description Text',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Main paragraph describing the project',
            rows: 6,
          },
        },
        {
          name: 'phases',
          label: 'Phases / Key Points',
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
              label: 'Phase Title',
              type: 'text',
              localized: true,
              admin: { description: 'e.g. "Integração do grupo"' },
            },
            {
              name: 'description',
              label: 'Phase Description',
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
      label: 'Objectives',
      admin: {
        description: 'Project objectives section with an intro paragraph and bullet items.',
      },
      fields: [
        {
          name: 'introduction',
          label: 'Introduction',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Introductory paragraph before the objectives list',
            rows: 4,
          },
        },
        {
          name: 'items',
          label: 'Objective Items',
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
              label: 'Objective',
              type: 'textarea',
              localized: true,
              required: true,
            },
          ],
        },
        PayloadImageField({
          name: 'objectivesImage',
          label: 'Objectives Image',
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
      label: 'Results',
      admin: {
        description: 'Project results — text on the left, image on the right.',
      },
      fields: [
        {
          name: 'text',
          label: 'Results Text',
          type: 'textarea',
          localized: true,
          admin: { rows: 6 },
        },
        PayloadImageField({
          name: 'resultsImage',
          label: 'Results Image',
          description: 'Image displayed alongside the results text',
        }),
      ],
    },

    /* -------------------------------------------------------------- */
    /*  6. PHOTO GALLERY                                              */
    /* -------------------------------------------------------------- */
    MultiImageField({
      name: 'gallery',
      label: 'Photo Gallery',
      description: 'Photos displayed at the bottom of the project page',
    }),
  ],
};

export default HawkProjectPageTab;

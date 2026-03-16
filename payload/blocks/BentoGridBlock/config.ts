import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import { link } from '@/payload/fields/link';
import { Block } from 'payload';

export const BentoGridBlock: Block = {
  slug: 'bentoGrid',
  labels: {
    singular: 'Bento Grid',
    plural: 'Bento Grids',
  },
  interfaceName: 'BentoGridBlock',
  admin: {
    group: 'Layout',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: 'Section Title',
      localized: true,
      admin: {
        description: 'Optional title displayed above the grid',
      },
    },
    {
      name: 'sectionDescription',
      type: 'textarea',
      label: 'Section Description',
      localized: true,
      admin: {
        description: 'Optional description displayed below the section title',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Grid Items',
      required: true,
      minRows: 1,
      interfaceName: 'BentoGridItem',
      admin: {
        description: 'Add items to the Bento Grid',
        components: {
          RowLabel: '@/payload/blocks/BentoGridBlock/admin/RowLabel',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          localized: true,
        },
        PayloadImageField({
          label: 'Background Image',
          name: 'backgroundImage',
          required: false,
        }),
        {
          name: 'overlayOpacity',
          type: 'select',
          label: 'Overlay Opacity',
          defaultValue: '50',
          admin: {
            description: 'Darkness of the overlay on the background image',
          },
          options: [
            { label: 'None', value: '0' },
            { label: 'Light (25%)', value: '25' },
            { label: 'Medium (50%)', value: '50' },
            { label: 'Dark (75%)', value: '75' },
            { label: 'Very Dark (90%)', value: '90' },
          ],
        },
        link({ localizedLabel: true, labelInformation: 'Call to Action Link' }),
        {
          name: 'column_size',
          type: 'select',
          label: 'Column Size',
          required: true,
          admin: {
            description: 'Select the width of the item based on grid columns (1 to 6)',
          },
          options: [
            { label: '1 Column', value: '1' },
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
            { label: '5 Columns', value: '5' },
            { label: '6 Columns', value: '6' },
          ],
          defaultValue: '2',
        },
        {
          name: 'row_size',
          type: 'select',
          label: 'Row Size',
          required: true,
          admin: {
            description: 'Select the height of the item based on grid rows (1 to 6)',
          },
          options: [
            { label: '1 Row', value: '1' },
            { label: '2 Rows', value: '2' },
            { label: '3 Rows', value: '3' },
            { label: '4 Rows', value: '4' },
            { label: '5 Rows', value: '5' },
            { label: '6 Rows', value: '6' },
          ],
          defaultValue: '1',
        },
        {
          name: 'contentPosition',
          type: 'select',
          label: 'Content Position',
          defaultValue: 'bottom-left',
          options: [
            { label: 'Top Left', value: 'top-left' },
            { label: 'Top Center', value: 'top-center' },
            { label: 'Top Right', value: 'top-right' },
            { label: 'Center Left', value: 'center-left' },
            { label: 'Center', value: 'center' },
            { label: 'Center Right', value: 'center-right' },
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Center', value: 'bottom-center' },
            { label: 'Bottom Right', value: 'bottom-right' },
          ],
        },
      ],
    },
    {
      name: 'rowGap',
      type: 'number',
      label: 'Row Gap (px)',
      required: false,
      defaultValue: 24,
    },
    {
      name: 'columnGap',
      type: 'number',
      label: 'Column Gap (px)',
      required: false,
      defaultValue: 16,
    },
    {
      name: 'numberColumns',
      type: 'select',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' },
      ],
      required: true,
      label: 'Number of Columns',
      admin: {
        description: 'Number of columns in the grid. Dividing the screen width in x columns.',
      },
      defaultValue: '6',
    },
    {
      name: 'minRowHeight',
      type: 'number',
      label: 'Minimum Row Height (px)',
      defaultValue: 200,
      admin: {
        description: 'Minimum height for each grid row',
      },
    },
    SectionID,
  ],
};

export default BentoGridBlock;

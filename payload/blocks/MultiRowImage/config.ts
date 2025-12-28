import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

const MultiRowImage: Block = {
  slug: 'multiRowImage',
  labels: {
    singular: 'Multi Row Image',
    plural: 'Multi Row Images',
  },
  interfaceName: 'MultiRowImageBlock',
  fields: [
    {
      name: 'rows',
      type: 'array',
      label: 'Image Rows',
      required: true,
      maxRows: 1,
      minRows: 1,
      fields: [
        {
          name: 'images',
          type: 'array',
          label: 'Images',
          required: true,
          minRows: 1,
          interfaceName: 'multiRowContent',
          fields: [
            PayloadImageField({ label: 'Image', name: 'image' }),
            {
              name: 'column_size',
              type: 'select',
              label: 'Column Image Size',
              required: true,
              admin: {
                description:
                  'Select the size of the image based on the grid columns. 1 to 6 columns.',
              },
              options: [
                { label: '1 Column', value: '1' },
                { label: '2 Columns', value: '2' },
                { label: '3 Columns', value: '3' },
                { label: '4 Columns', value: '4' },
                { label: '5 Columns', value: '5' },
                { label: '6 Columns', value: '6' },
              ],
            },
            {
              name: 'row_size',
              type: 'select',
              required: true,
              label: 'Row Image Size',
              admin: {
                description: 'Select the size of the image based on the grid rows. 1 to 6 rows.',
              },
              options: [
                { label: '1 Row', value: '1' },
                { label: '2 Rows', value: '2' },
                { label: '3 Rows', value: '3' },
                { label: '4 Rows', value: '4' },
                { label: '5 Rows', value: '5' },
                { label: '6 Rows', value: '6' },
              ],
            },
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
    SectionID,
  ],
};

export default MultiRowImage;

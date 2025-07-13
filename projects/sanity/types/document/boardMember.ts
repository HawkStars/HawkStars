import { defineField, defineType } from 'sanity';
import { CaseIcon } from '@sanity/icons';
import { BlockComponent } from '../../components/items/BoardMemberItem';

export default defineType({
  name: 'board_member',
  title: 'Board Member',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'section',
      title: 'Section',
      type: 'string',
      description: 'Section out of the three that is to add the member',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: 'Assembleia Geral', value: 'geral' },
          { title: 'Conselho Fiscal', value: 'fiscal' },
          { title: 'Direção', value: 'board' },
        ],
      },
    }),
    defineField({
      name: 'title',
      title: 'Position Title',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: 'Presidente', value: 'president' },
          { title: 'Vice-Presidente', value: 'vice_president' },
          { title: 'Vogal', value: 'vogal' },
          { title: 'Secretária', value: 'f_secretary' },
          { title: 'Secretário', value: 'm_secretary' },
          { title: 'Suplente', value: 'substitute' },
          { title: 'Tesoureiro', value: 'treasurer' },
          { title: 'Secretário Relator', value: 'rapporteur_secretary' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'cloudinary.asset' }],
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'social_link' }],
    }),
    defineField({
      name: 'position',
      title: 'Position',
      description: 'Position to be ordered to be shown on the page',
      type: 'number',
    }),
  ],
  components: {
    // preview: BlockComponent,
    item: BlockComponent,
  },
});

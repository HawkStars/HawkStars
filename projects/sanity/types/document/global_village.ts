import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'global_village',
  title: 'Global Village',
  type: 'document',
  description: 'Informação do global village até eu criar o tipo da pagina.',
  fields: [
    defineField({
      name: 'hero_block',
      title: 'Hero Block - Primeiro Bloco',
      type: 'hero',
      description: 'Primeiro Bloco do Global Village',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'second_block',
      title: 'Second Block',
      type: 'internationalizedArrayFormattedText',
      description: 'Texto do segundo bloco do Global Village',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'third_block',
      title: 'Terceiro Bloco',
      type: 'hero',
      description: 'Terceiro Bloco do Global Village',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'objectives',
      title: 'Lista Valores',
      type: 'list',
      description: 'Lista dos objectivos do global village',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Village',
      };
    },
  },
});

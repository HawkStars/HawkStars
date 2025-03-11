import { defineField } from 'sanity';
import { InternationalizedArrayString } from '../../sanity.types';

const SEOFields = [
  defineField({
    name: 'google_description',
    title: 'Description for Google',
    description: 'Description to be shown to the google search. recommended 255 characters',
    type: 'internationalizedArrayString',
    group: 'seo',
    fieldset: 'seo',
    validation: (rule) =>
      rule.custom((blocks: InternationalizedArrayString) => {
        const blockWithMoreThanRecommended = blocks.filter(
          (block) => block.value && block.value?.length > 255
        );
        if (blockWithMoreThanRecommended.length > 0)
          return {
            message: 'Descriptions should be maximum of 255 characters',
          };
        return true;
      }),
  }),
  defineField({
    name: 'google_keywords',
    title: 'Keywords for Google',
    description: 'Keywords to be shown to the google search. Separate each keyword with a comma',
    type: 'internationalizedArrayString',
    group: 'seo',
    fieldset: 'seo',
  }),
];

const SEOFieldset = {
  name: 'seo',
  group: 'seo',
  title: 'Search Engine Optimization',
  description: 'Google SEO search fields',
};

const SEOGroup = {
  name: 'seo',
  title: 'SEO',
};

export { SEOGroup, SEOFields, SEOFieldset };

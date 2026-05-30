import { PayloadImageField } from '@/payload/fields/ImageType';
import { GroupField } from 'payload';

const BannerFields: GroupField = {
  name: 'bannerFields',
  label: { en: 'Banner', pt: 'Banner' },
  type: 'group',
  interfaceName: 'MainPageBannerFields',
  admin: {
    description: 'Optional banner displayed at the top of the page.',
  },
  fields: [
    {
      name: 'bannerText',
      label: { en: 'Banner Text', pt: 'Texto do Banner' },
      type: 'text',
      admin: { position: 'sidebar', description: 'Text to display in the banner' },
      required: false,
      localized: true,
    },
    {
      name: 'bannerButtonLink',
      label: { en: 'Banner Button Link', pt: 'Link do Botão do Banner' },
      type: 'text',
      admin: { position: 'sidebar', description: 'Optional URL for the banner button' },
      required: false,
    },
    {
      name: 'bannerColor',
      type: 'text',
      label: { en: 'Banner Text Color', pt: 'Cor do Texto do Banner' },
      required: false,
      admin: {
        description: 'Hex color code for the banner background (e.g. #ff0000)',
        components: {
          afterInput: ['@/payload/globals/MainPage/fields/components/BannerColorAfterInputField'],
        },
      },
      validate: (value: string | undefined | null) => {
        if (!value) return true; // Allow empty value
        const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
        return hexColorRegex.test(value) || 'Please enter a valid hex color code (e.g. #ff0000)';
      },
    },
    {
      name: 'bannerButtonText',
      label: { en: 'Banner Button Text', pt: 'Texto do Botão do Banner' },
      type: 'text',
      admin: { description: 'Optional text for the banner button' },
      required: false,
      localized: true,
    },

    PayloadImageField({
      name: 'bannerImage',
      label: 'Imagem do Banner',
      hideGutter: true,
      description:
        'Optional image for the banner. Will be used as a background on desktop and inline on mobile.',
      required: false,
    }),
  ],
};

export default BannerFields;

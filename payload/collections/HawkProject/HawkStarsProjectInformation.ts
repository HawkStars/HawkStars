import { Tab } from 'payload';
import { PLATFORM_OPTIONS } from './config';

const HawkStarsProjectInformation: Tab = {
  name: 'hawkStarsInformation',
  label: { en: 'HawkStars Information', pt: 'Informação HawkStars' },
  interfaceName: 'HawkStarsProjectInformation',
  admin: {
    description: {
      en: 'Information about the project’s HawkStars, including their names, roles, and contributions.',
      pt: 'Informação sobre os HawkStars do projeto, incluindo nomes, funções e contribuições.',
    },
  },
  fields: [
    {
      name: 'type',
      label: { en: 'Type', pt: 'Tipo' },
      type: 'select',
      required: true,
      defaultValue: 'hosting_org',
      options: [
        {
          label: { en: 'Hosting organisation', pt: 'Organização de Acolhimento' },
          value: 'hosting_org',
        },
        {
          label: { en: 'Sending organisation', pt: 'Organização de Envio' },
          value: 'sending_org',
        },
      ],
    },
    {
      name: 'documents',
      label: { en: 'Documents', pt: 'Documentos' },
      type: 'array',
      interfaceName: 'HawkStarsProjectDocument',
      admin: {
        description: {
          en: 'Documents related to the HawkStars, such as reports, presentations, or other relevant files.',
          pt: 'Documentos relacionados aos HawkStars, como relatórios, apresentações ou outros arquivos relevantes.',
        },
        initCollapsed: true,
        components: {
          RowLabel: '@/payload/collections/HawkProject/components/partners/ReportsRowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          label: { en: 'Document Label', pt: 'Rótulo do Documento' },
          type: 'text',
          localized: true,
        },
        {
          name: 'url',
          label: { en: 'Document URL', pt: 'URL do Documento' },
          type: 'text',
          required: true,
        },
        {
          name: 'platform',
          label: { en: 'Platform', pt: 'Plataforma' },
          type: 'select',
          required: true,
          options: PLATFORM_OPTIONS,
        },
      ],
    },
  ],
};

export default HawkStarsProjectInformation;

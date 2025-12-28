import { Field } from 'payload';
import { ExternalImageField, ImageTypeField, UploadField } from '../Image/fields';

type ImageTypeGroupProps = {
  label?: string;
  name?: string;
  required?: boolean;
};

export const PayloadImageField = ({
  label = 'Image Data',
  name = 'imageField',
  required = false,
}: ImageTypeGroupProps) =>
  ({
    name: name,
    label: label,
    type: 'group',
    interfaceName: 'ImageType',
    required,
    fields: [
      ImageTypeField,
      UploadField,
      ExternalImageField,
      { name: 'alt', type: 'text', label: 'Label Text', required: true },
    ],
  }) as Field;

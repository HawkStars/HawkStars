import { Field } from 'payload';
import { ExternalImageField, ImageTypeField, UploadField } from '../Image/fields';

type ImageTypeGroupProps = {
  label?: string;
  name?: string;
};

export const PayloadImageField = ({
  label = 'Image Data',
  name = 'imageField',
}: ImageTypeGroupProps) =>
  ({
    name: name,
    label: label,
    type: 'group',
    interfaceName: 'ImageType',
    fields: [
      ImageTypeField,
      UploadField,
      ExternalImageField,
      { name: 'alt', type: 'text', label: 'Label Text', required: true },
    ],
  }) as Field;

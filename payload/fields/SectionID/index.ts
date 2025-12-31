import { Field } from 'payload';

const SectionID: Field = {
  name: 'sectionId',
  type: 'text',
  label: 'Section ID',
  admin: { description: 'Unique identifier for the section (used for anchor links)' },
  validate: (value: string | undefined | null) => {
    if (!value || value.length === 0) return true;
    // regex to check for only lowercase letters and no spaces
    if (!/^[a-zA-Z\-]+$/.test(value))
      return 'Key needs to be always lowercase letters or - with no spaces';

    return true;
  },
  required: false,
  localized: false,
};

export default SectionID;

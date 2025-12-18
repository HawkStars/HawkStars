import { Field } from 'payload';

const SectionID: Field = {
  name: 'sectionId',
  type: 'text',
  label: 'Section ID',
  admin: { description: 'Unique identifier for the section (used for anchor links)' },
  required: false,
  localized: false,
};

export default SectionID;

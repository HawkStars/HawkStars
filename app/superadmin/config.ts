export type SuperAdminSection =
  | 'dashboard'
  | 'add_contribution'
  | 'add_organization_movement'
  | 'erasmus'
  | 'events'
  | 'settings';

const superAdminSections = [
  { section: 'dashboard', label: 'Dashboard' },
  { section: 'add_contribution', label: 'Add Contribution/Donation' },
  { section: 'add_organization_movement', label: 'Organization Movements' },
  { section: 'erasmus', label: 'Erasmus Ativities' },
  { section: 'events', label: 'Hawk Events' },
  { section: 'settings', label: 'Settings' },
] as {
  section: SuperAdminSection;
  label: string;
}[];

export { superAdminSections };

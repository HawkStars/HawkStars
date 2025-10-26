export const boardSections = ['geral', 'fiscal', 'board'] as const;
export type OrgSectionTuple = typeof boardSections;
export type OrgSection = OrgSectionTuple[number];

export const sectionLabels = {
  geral: 'geral',
  fiscal: 'fiscal',
  board: 'board',
};

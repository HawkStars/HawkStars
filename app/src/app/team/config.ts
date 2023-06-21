export const boardSections = ["geral", "fiscal", "board"] as const;
export type OrgSectionTuple = typeof boardSections;
export type OrgSection = OrgSectionTuple[number];

export const TeamPageSections = {
  geral: "Assembleia Geral",
  fiscal: "Conselho Fiscal",
  board: "Direção",
};

export const TeamMembers = {
  geral: [],
  fiscal: [],
  board: [],
};

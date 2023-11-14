type AboutObjectiveSection = {
  icon: string;
  title: string;
  description: string;
};

export const aboutObjectiveSections: AboutObjectiveSection[] = [
  {
    icon: "/about/card-icons/rececao.png",
    title: "objectives.one.title",
    description: `objectives.one.description`,
  },
  {
    icon: "/about/card-icons/hosting.png",
    title: "objectives.two.title",
    description: "objectives.two.description",
  },
  {
    icon: "/about/card-icons/development.png",
    title: "objectives.three.title",
    description: `objectives.three.description`,
  },
  {
    icon: "/about/card-icons/promotion.png",
    title: "objectives.four.title",
    description: `objectives.four.description`,
  },
  {
    icon: "/about/card-icons/cooperacao.png",
    title: "objectives.five.title",
    description: `objectives.five.description`,
  },
  {
    icon: "/about/card-icons/co-working.png",
    title: "objectives.six.title",
    description: `objectives.six.description`,
  },
  {
    icon: "/about/card-icons/ativities.png",
    title: "objectives.seven.title",
    description: `objectives.seven.description`,
  },
  {
    icon: "/about/card-icons/music.png",
    title: "objectives.eight.title",
    description: `objectives.eight.description`,
  },
  {
    icon: "/about/card-icons/sharing.png",
    title: "objectives.nine.title",
    description: `objectives.nine.description`,
  },
];

export const missionObjectives: { text: string; id: number }[] = [
  {
    text: "mission.one",
    id: 1,
  },
  {
    text: "mission.two",
    id: 2,
  },
  {
    text: "mission.three",
    id: 3,
  },
  {
    text: "mission.four",
    id: 4,
  },
  {
    text: "mission.five",
    id: 5,
  },
  { text: "mission.six", id: 6 },
];

export const visionGoals = ["platform", "projects", "local"] as const;

// ── Flagship Programmes ──
const flagshipCards = [
  {
    icon: '🎓',
    badgeKey: 'flagship_badge_education',
    titleKey: 'flagship_erasmus_title',
    descKey: 'flagship_erasmus_desc',
    linkKey: 'flagship_erasmus_link',
    href: 'https://erasmus-plus.ec.europa.eu',
    accentColor: '#003399',
  },
  {
    icon: '🤝',
    badgeKey: 'flagship_badge_volunteering',
    titleKey: 'flagship_esc_title',
    descKey: 'flagship_esc_desc',
    linkKey: 'flagship_esc_link',
    href: 'https://youth.europa.eu/solidarity-corps_en',
    accentColor: '#2ec4b6',
  },
  {
    icon: '💼',
    badgeKey: 'flagship_badge_work',
    titleKey: 'flagship_eures_title',
    descKey: 'flagship_eures_desc',
    linkKey: 'flagship_eures_link',
    href: 'https://eures.europa.eu',
    accentColor: '#ff9f1c',
  },
  {
    icon: '🌐',
    badgeKey: 'flagship_badge_digital',
    titleKey: 'flagship_digital_title',
    descKey: 'flagship_digital_desc',
    linkKey: 'flagship_digital_link',
    href: 'https://digital-skills-jobs.europa.eu',
    accentColor: '#e63946',
  },
] as const;

const opportunityCards = [
  { icon: '🚂', titleKey: 'opp_discovereu_title', descKey: 'opp_discovereu_desc' },
  { icon: '🏛️', titleKey: 'opp_europass_title', descKey: 'opp_europass_desc' },
  { icon: '🧪', titleKey: 'opp_marie_title', descKey: 'opp_marie_desc' },
  { icon: '🌱', titleKey: 'opp_eit_title', descKey: 'opp_eit_desc' },
  { icon: '🗳️', titleKey: 'opp_portal_title', descKey: 'opp_portal_desc' },
  { icon: '💡', titleKey: 'opp_youth_action_title', descKey: 'opp_youth_action_desc' },
] as const;

// ── How to Apply ──

const applySteps = [
  { titleKey: 'step_eligibility_title', descKey: 'step_eligibility_desc' },
  { titleKey: 'step_find_title', descKey: 'step_find_desc' },
  { titleKey: 'step_prepare_title', descKey: 'step_prepare_desc' },
  { titleKey: 'step_submit_title', descKey: 'step_submit_desc' },
  { titleKey: 'step_go_title', descKey: 'step_go_desc' },
] as const;

// ── Eligibility ──

const eligibilityItems = [
  { icon: '🎒', titleKey: 'elig_students_title', descKey: 'elig_students_desc' },
  { icon: '🛠️', titleKey: 'elig_vet_title', descKey: 'elig_vet_desc' },
  { icon: '🙋', titleKey: 'elig_neet_title', descKey: 'elig_neet_desc' },
  { icon: '👩‍🏫', titleKey: 'elig_workers_title', descKey: 'elig_workers_desc' },
  { icon: '🌍', titleKey: 'elig_partners_title', descKey: 'elig_partners_desc' },
] as const;

export { flagshipCards, opportunityCards, applySteps, eligibilityItems };

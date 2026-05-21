// ── Types ──

export type TranslationFn = (key: string) => string;

export type KAData = {
  id: string;
  numberDisplay: string;
  numberSize?: string;
  pillKey: string;
  titleKey: string;
  taglineKey: string;
  color: string;
  lightColor: string;
  tabColor: string;
  detailKeys: { labelKey: string; valueKey: string }[];
  activityKeys: { icon: string; titleKey: string; descKey: string }[];
  whoIcon: string;
  whoTagKeys: string[];
};

// ── KA Data ──

export const kaData: KAData[] = [
  {
    id: 'ka1',
    numberDisplay: 'KA1',
    pillKey: 'ka1_pill',
    titleKey: 'ka1_title',
    taglineKey: 'ka1_tagline',
    color: '#1a6b5a',
    lightColor: '#e6f4f1',
    tabColor: '#4dd9bc',
    detailKeys: [
      { labelKey: 'ka1_detail_duration_label', valueKey: 'ka1_detail_duration_value' },
      { labelKey: 'ka1_detail_who_label', valueKey: 'ka1_detail_who_value' },
      { labelKey: 'ka1_detail_funding_label', valueKey: 'ka1_detail_funding_value' },
      { labelKey: 'ka1_detail_countries_label', valueKey: 'ka1_detail_countries_value' },
    ],
    activityKeys: [
      { icon: '🎓', titleKey: 'ka1_act1_title', descKey: 'ka1_act1_desc' },
      { icon: '🛠️', titleKey: 'ka1_act2_title', descKey: 'ka1_act2_desc' },
      { icon: '📚', titleKey: 'ka1_act3_title', descKey: 'ka1_act3_desc' },
      { icon: '🏫', titleKey: 'ka1_act4_title', descKey: 'ka1_act4_desc' },
      { icon: '🌱', titleKey: 'ka1_act5_title', descKey: 'ka1_act5_desc' },
      { icon: '👩‍🏫', titleKey: 'ka1_act6_title', descKey: 'ka1_act6_desc' },
    ],
    whoIcon: '👤',
    whoTagKeys: [
      'ka1_who1',
      'ka1_who2',
      'ka1_who3',
      'ka1_who4',
      'ka1_who5',
      'ka1_who6',
      'ka1_who7',
      'ka1_who8',
    ],
  },
  {
    id: 'ka2',
    numberDisplay: 'KA2',
    pillKey: 'ka2_pill',
    titleKey: 'ka2_title',
    taglineKey: 'ka2_tagline',
    color: '#7b2d8b',
    lightColor: '#f3e8f7',
    tabColor: '#d18ddf',
    detailKeys: [
      { labelKey: 'ka2_detail_length_label', valueKey: 'ka2_detail_length_value' },
      { labelKey: 'ka2_detail_who_label', valueKey: 'ka2_detail_who_value' },
      { labelKey: 'ka2_detail_partners_label', valueKey: 'ka2_detail_partners_value' },
      { labelKey: 'ka2_detail_focus_label', valueKey: 'ka2_detail_focus_value' },
    ],
    activityKeys: [
      { icon: '🤝', titleKey: 'ka2_act1_title', descKey: 'ka2_act1_desc' },
      { icon: '🔬', titleKey: 'ka2_act2_title', descKey: 'ka2_act2_desc' },
      { icon: '🏗️', titleKey: 'ka2_act3_title', descKey: 'ka2_act3_desc' },
      { icon: '🌍', titleKey: 'ka2_act4_title', descKey: 'ka2_act4_desc' },
      { icon: '🏅', titleKey: 'ka2_act5_title', descKey: 'ka2_act5_desc' },
      { icon: '🌐', titleKey: 'ka2_act6_title', descKey: 'ka2_act6_desc' },
    ],
    whoIcon: '🏛️',
    whoTagKeys: [
      'ka2_who1',
      'ka2_who2',
      'ka2_who3',
      'ka2_who4',
      'ka2_who5',
      'ka2_who6',
      'ka2_who7',
      'ka2_who8',
    ],
  },
  {
    id: 'ka3',
    numberDisplay: 'KA3',
    pillKey: 'ka3_pill',
    titleKey: 'ka3_title',
    taglineKey: 'ka3_tagline',
    color: '#c0392b',
    lightColor: '#fdecea',
    tabColor: '#f08080',
    detailKeys: [
      { labelKey: 'ka3_detail_lead_label', valueKey: 'ka3_detail_lead_value' },
      { labelKey: 'ka3_detail_focus_label', valueKey: 'ka3_detail_focus_value' },
      { labelKey: 'ka3_detail_eligible_label', valueKey: 'ka3_detail_eligible_value' },
      { labelKey: 'ka3_detail_framework_label', valueKey: 'ka3_detail_framework_value' },
    ],
    activityKeys: [
      { icon: '🗣️', titleKey: 'ka3_act1_title', descKey: 'ka3_act1_desc' },
      { icon: '📋', titleKey: 'ka3_act2_title', descKey: 'ka3_act2_desc' },
      { icon: '🔎', titleKey: 'ka3_act3_title', descKey: 'ka3_act3_desc' },
      { icon: '🤝', titleKey: 'ka3_act4_title', descKey: 'ka3_act4_desc' },
    ],
    whoIcon: '🏛️',
    whoTagKeys: ['ka3_who1', 'ka3_who2', 'ka3_who3', 'ka3_who4', 'ka3_who5', 'ka3_who6'],
  },
  {
    id: 'jean',
    numberDisplay: 'JM',
    numberSize: 'text-6xl',
    pillKey: 'jm_pill',
    titleKey: 'jm_title',
    taglineKey: 'jm_tagline',
    color: '#1c4e80',
    lightColor: '#e8f0fb',
    tabColor: '#7eb8f7',
    detailKeys: [
      { labelKey: 'jm_detail_duration_label', valueKey: 'jm_detail_duration_value' },
      { labelKey: 'jm_detail_who_label', valueKey: 'jm_detail_who_value' },
      { labelKey: 'jm_detail_open_label', valueKey: 'jm_detail_open_value' },
      { labelKey: 'jm_detail_grant_label', valueKey: 'jm_detail_grant_value' },
    ],
    activityKeys: [
      { icon: '📖', titleKey: 'jm_act1_title', descKey: 'jm_act1_desc' },
      { icon: '🏛️', titleKey: 'jm_act2_title', descKey: 'jm_act2_desc' },
      { icon: '🔗', titleKey: 'jm_act3_title', descKey: 'jm_act3_desc' },
      { icon: '🏢', titleKey: 'jm_act4_title', descKey: 'jm_act4_desc' },
    ],
    whoIcon: '🎓',
    whoTagKeys: ['jm_who1', 'jm_who2', 'jm_who3', 'jm_who4', 'jm_who5', 'jm_who6'],
  },
  {
    id: 'sport',
    numberDisplay: 'SP',
    numberSize: 'text-7xl',
    pillKey: 'sport_pill',
    titleKey: 'sport_title',
    taglineKey: 'sport_tagline',
    color: '#d4660a',
    lightColor: '#fdf0e6',
    tabColor: '#f0b97a',
    detailKeys: [
      { labelKey: 'sport_detail_length_label', valueKey: 'sport_detail_length_value' },
      { labelKey: 'sport_detail_partners_label', valueKey: 'sport_detail_partners_value' },
      { labelKey: 'sport_detail_focus_label', valueKey: 'sport_detail_focus_value' },
      { labelKey: 'sport_detail_grant_label', valueKey: 'sport_detail_grant_value' },
    ],
    activityKeys: [
      { icon: '⚽', titleKey: 'sport_act1_title', descKey: 'sport_act1_desc' },
      { icon: '🏋️', titleKey: 'sport_act2_title', descKey: 'sport_act2_desc' },
      { icon: '🛡️', titleKey: 'sport_act3_title', descKey: 'sport_act3_desc' },
      { icon: '📊', titleKey: 'sport_act4_title', descKey: 'sport_act4_desc' },
    ],
    whoIcon: '🏟️',
    whoTagKeys: [
      'sport_who1',
      'sport_who2',
      'sport_who3',
      'sport_who4',
      'sport_who5',
      'sport_who6',
    ],
  },
];

// ── Comparison Table ──

export const comparisonRows = [
  {
    color: '#1a6b5a',
    nameKey: 'compare_ka1_name',
    focusKey: 'compare_ka1_focus',
    whoKey: 'compare_ka1_who',
    durationKey: 'compare_ka1_duration',
    fundingKey: 'compare_ka1_funding',
  },
  {
    color: '#7b2d8b',
    nameKey: 'compare_ka2_name',
    focusKey: 'compare_ka2_focus',
    whoKey: 'compare_ka2_who',
    durationKey: 'compare_ka2_duration',
    fundingKey: 'compare_ka2_funding',
  },
  {
    color: '#c0392b',
    nameKey: 'compare_ka3_name',
    focusKey: 'compare_ka3_focus',
    whoKey: 'compare_ka3_who',
    durationKey: 'compare_ka3_duration',
    fundingKey: 'compare_ka3_funding',
  },
  {
    color: '#1c4e80',
    nameKey: 'compare_jm_name',
    focusKey: 'compare_jm_focus',
    whoKey: 'compare_jm_who',
    durationKey: 'compare_jm_duration',
    fundingKey: 'compare_jm_funding',
  },
  {
    color: '#d4660a',
    nameKey: 'compare_sport_name',
    focusKey: 'compare_sport_focus',
    whoKey: 'compare_sport_who',
    durationKey: 'compare_sport_duration',
    fundingKey: 'compare_sport_funding',
  },
] as const;

// ── Hero Section ──

export const kaTabs = [
  {
    href: '#ka1',
    labelKey: 'tab_ka1',
    colorClass: 'hover:text-erasmus-ka1 hover:border-erasmus-ka1',
  },
  {
    href: '#ka2',
    labelKey: 'tab_ka2',
    colorClass: 'hover:text-erasmus-ka2 hover:border-erasmus-ka2',
  },
  {
    href: '#ka3',
    labelKey: 'tab_ka3',
    colorClass: 'hover:text-erasmus-ka3 hover:border-erasmus-ka3',
  },
  {
    href: '#jean',
    labelKey: 'tab_jean',
    colorClass: 'hover:text-erasmus-jm hover:border-erasmus-jm',
  },
  {
    href: '#sport',
    labelKey: 'tab_sport',
    colorClass: 'hover:text-erasmus-sport hover:border-erasmus-sport',
  },
] as const;

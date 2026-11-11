// ── Types ──

export type TranslationFn = (key: string) => string;

// ── Project formats Hawk Stars sends people to ──

export const formatCards = [
  { icon: '🌍', titleKey: 'format_ye_title', ageKey: 'format_ye_age', descKey: 'format_ye_desc' },
  { icon: '🧭', titleKey: 'format_tc_title', ageKey: 'format_tc_age', descKey: 'format_tc_desc' },
  {
    icon: '🤝',
    titleKey: 'format_esc_title',
    ageKey: 'format_esc_age',
    descKey: 'format_esc_desc',
  },
] as const;

// ── The journey, in order ──

export const joinSteps = [
  {
    id: 'find',
    icon: '🔎',
    titleKey: 'step_find_title',
    descKey: 'step_find_desc',
    tipKey: 'step_find_tip',
  },
  {
    id: 'check',
    icon: '✅',
    titleKey: 'step_check_title',
    descKey: 'step_check_desc',
    tipKey: 'step_check_tip',
  },
  {
    id: 'apply',
    icon: '✍️',
    titleKey: 'step_apply_title',
    descKey: 'step_apply_desc',
    tipKey: 'step_apply_tip',
  },
  {
    id: 'select',
    icon: '💬',
    titleKey: 'step_select_title',
    descKey: 'step_select_desc',
    tipKey: 'step_select_tip',
  },
  {
    id: 'prepare',
    icon: '🎒',
    titleKey: 'step_prepare_title',
    descKey: 'step_prepare_desc',
    tipKey: 'step_prepare_tip',
  },
  {
    id: 'live',
    icon: '✈️',
    titleKey: 'step_live_title',
    descKey: 'step_live_desc',
    tipKey: 'step_live_tip',
  },
  {
    id: 'after',
    icon: '🏅',
    titleKey: 'step_after_title',
    descKey: 'step_after_desc',
    tipKey: 'step_after_tip',
  },
] as const;

// ── What the grant covers vs. what is on you ──

export const coveredItems = [
  'covered_travel',
  'covered_stay',
  'covered_food',
  'covered_programme',
  'covered_youthpass',
] as const;

export const yourPartItems = [
  'yours_id',
  'yours_insurance',
  'yours_receipts',
  'yours_presence',
  'yours_dissemination',
] as const;

// ── FAQ ──

export const faqItems = [
  { qKey: 'faq_cost_q', aKey: 'faq_cost_a' },
  { qKey: 'faq_language_q', aKey: 'faq_language_a' },
  { qKey: 'faq_experience_q', aKey: 'faq_experience_a' },
  { qKey: 'faq_member_q', aKey: 'faq_member_a' },
  { qKey: 'faq_residence_q', aKey: 'faq_residence_a' },
  { qKey: 'faq_inclusion_q', aKey: 'faq_inclusion_a' },
] as const;

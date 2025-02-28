import groq from 'groq';

export const getChairsContributionsQuery = groq`*[_type == "contribution" && contribution_type in ['OFFICE_CHAIR', 'SIMULATOR_CHAIR', 'LOUNGE_CHAIR', 'AUDITORIUM_CHAIR']]`;
export const totalMoneyGatheredQuery = groq`math::sum(*[_type == 'contribution' && is_confirmed == true && contribution_type in ['BANK', 'CRYPTO']].value)`;

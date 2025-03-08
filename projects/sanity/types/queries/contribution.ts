import groq from 'groq';

export const getChairsContributionsQuery = groq`*[_type == "contribution" && is_confirmed == true &&
    contribution_type in ['OFFICE_CHAIR', 'SIMULATOR_CHAIR', 'LOUNGE_CHAIR', 'AUDITORIUM_CHAIR']]`;
export const totalMoneyGatheredQuery = groq`math::sum(*[_type == 'contribution' && is_confirmed == true && contribution_type in ['BANK', 'CRYPTO']].value)`;

export const countContributionQuery = groq`count(*[_type == "contribution" && is_confirmed == true])`;
export const firstPageContributionQuery = groq`*[_type == "contribution" && is_confirmed == true] { contribution_date, contribution_type, donor, value, _id, _updatedAt }
    | order(_updatedAt asc) [0...100]`;
export const nextPageContributionQuery = groq`*[_type == "contribution" && is_confirmed == true && 
    (publishedAt > $lastPublishedAt || (publishedAt == $lastPublishedAt && _id > $lastId))] { contribution_date, contribution_type, donor, value, _id, _updatedAt }
    | order(_updatedAt asc) [0...100]`;

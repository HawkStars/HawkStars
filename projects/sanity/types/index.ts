// Sanity documents
import art from './document/artwork';
import board_member from './document/boardMember';
import contribution from './document/contribution';
import curator from './document/curator';
import event from './document/event';
import global_village from './document/global_village';
import partner from './document/partner';

// Object Documents
import socialLink from './objects/socialLink';
import hero from './objects/hero';
import list from './objects/list';
import accordion from './objects/accordion';
import youtube from './objects/embedYoutube';

export const documentSchemaTypes = [
  curator,
  art,
  event,
  contribution,
  board_member,
  global_village,
  partner,
];

export const objectSchemaTypes = [socialLink, hero, list, accordion, youtube];

export const allSchemaTypes = [...documentSchemaTypes, ...objectSchemaTypes];

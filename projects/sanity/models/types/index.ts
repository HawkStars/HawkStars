// Sanity documents
import art from './document/artwork';
import board_member from './document/boardMember';
import contribution from './document/contribution';
import curator from './document/curator';
import event from './document/event';
import global_village from './document/global_village';
// import news from './document/news';
// import report from './document/report';

// Object Documents
import socialLink from './objects/socialLink';
import hero from './objects/hero';
import list from './objects/list';
import accordion from './objects/accordion';

export const documentSchemaTypes = [
  curator,
  art,
  event,
  contribution,
  board_member,
  global_village,
];

export const objectSchemaTypes = [socialLink, hero, list, accordion];

export const allSchemaTypes = [...documentSchemaTypes, ...objectSchemaTypes];

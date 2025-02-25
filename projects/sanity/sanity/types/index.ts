// Sanity documents
import art from './document/artwork';
import board_member from './document/boardMember';
import contribution from './document/contribution';
import curator from './document/curator';
import erasmus from './document/erasmus';
import event from './document/event';
import news from './document/news';
import report from './document/report';

// Object Documents
import socialLink from './objects/socialLink';

export const documentSchemaTypes = [
  curator,
  art,
  erasmus,
  event,
  contribution,
  news,
  report,
  board_member,
];

export const objectSchemaTypes = [socialLink];

export const allSchemaTypes = [...documentSchemaTypes, ...objectSchemaTypes];

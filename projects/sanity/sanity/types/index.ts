// Sanity documents
import art from './document/artwork';
import contribution from './document/contribution';
import curator from './document/curator';
import erasmus from './document/erasmus';
import event from './document/event';
import news from './document/news';
import report from './document/report';

// Sanity Objects
import art_property from './objects/art_property';

export const documentSchemaTypes = [curator, art, erasmus, event, contribution, news, report];
export const objectSchemaTypes = [art_property];

export const allSchemaTypes = [...documentSchemaTypes, ...objectSchemaTypes];

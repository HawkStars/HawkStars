// Sanity documents
import art from './document/artwork';
import contribution from './document/contribution';
import curator from './document/curator';
import erasmus from './document/erasmus';
import event from './document/event';
import news from './document/news';
import report from './document/report';

export const documentSchemaTypes = [curator, art, erasmus, event, contribution, news, report];

export const allSchemaTypes = [...documentSchemaTypes];

import { describe, it, expect } from 'vitest';
import { isHttpUrl } from './paths';

/**
 * `isHttpUrl` is the one guard between a public submission form and a stored-XSS
 * vector: `/api/member-projects` accepts URLs that an admin later confirms and
 * the site then renders as an href or an iframe src. `z.url()` alone accepts
 * `javascript:` and `data:`, which is why this exists — and it had no test.
 */
describe('isHttpUrl', () => {
  it.each(['http://example.org', 'https://example.org', 'https://example.org/a?b=c#d'])(
    'accepts %s',
    (url) => expect(isHttpUrl(url)).toBe(true)
  );

  it.each([
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    'ftp://example.org',
  ])('rejects %s', (url) => expect(isHttpUrl(url)).toBe(false));

  it.each(['', '   ', 'not a url', '//example.org', '/relative/path'])(
    'rejects unparseable input %s',
    (url) => expect(isHttpUrl(url)).toBe(false)
  );
});

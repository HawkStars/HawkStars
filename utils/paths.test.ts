import { describe, it, expect } from 'vitest';
import { isHttpUrl, isLinkUrl } from './paths';

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

/** CMS link targets: web URLs plus contact schemes, never script-capable ones. */
describe('isLinkUrl', () => {
  it.each([
    'https://example.org',
    'mailto:geral@hawkstars.org?subject=Ol%C3%A1',
    'tel:112',
    'tel:+351116111',
  ])('accepts %s', (url) => expect(isLinkUrl(url)).toBe(true));

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'data:text/html,<script>1</script>',
    'vbscript:x',
    'ftp://example.org',
    '/relative',
    '',
  ])('rejects %s', (url) => expect(isLinkUrl(url)).toBe(false));

  it('still rejects mailto/tel where only web URLs are allowed', () => {
    expect(isHttpUrl('mailto:geral@hawkstars.org')).toBe(false);
    expect(isHttpUrl('tel:112')).toBe(false);
  });
});

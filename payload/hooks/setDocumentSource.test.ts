import { describe, expect, it } from 'vitest';
import { setDocumentSource } from './setDocumentSource';

type HookArgs = Parameters<typeof setDocumentSource>[0];

const run = (args: Partial<HookArgs> & { data: Record<string, unknown> }) =>
  setDocumentSource({
    collection: {} as HookArgs['collection'],
    context: {},
    req: { context: {} } as HookArgs['req'],
    ...args,
  } as HookArgs);

describe('setDocumentSource', () => {
  it('marks a normal upload as uploaded, even if the caller claims otherwise', () => {
    const data = run({ operation: 'create', data: { filename: 'id-1', source: 'linked' } });
    expect(data).toMatchObject({ source: 'uploaded' });
  });

  it('marks server-side links as linked', () => {
    const data = run({
      operation: 'create',
      data: { filename: 'id-1' },
      req: { context: { linkDriveDocument: true } } as unknown as HookArgs['req'],
    });
    expect(data).toMatchObject({ source: 'linked' });
  });

  it('still requires a file on create', () => {
    expect(() => run({ operation: 'create', data: { title: 'x' } })).toThrow('A file is required');
  });

  it('keeps the stored source on update, and switches to uploaded when the file is replaced', () => {
    const kept = run({
      operation: 'update',
      data: { source: 'uploaded' },
      originalDoc: { source: 'linked' } as HookArgs['originalDoc'],
    });
    expect(kept).toMatchObject({ source: 'linked' });

    const replaced = run({
      operation: 'update',
      data: {},
      originalDoc: { source: 'linked' } as HookArgs['originalDoc'],
      req: { context: {}, file: { name: 'new.pdf' } } as unknown as HookArgs['req'],
    });
    expect(replaced).toMatchObject({ source: 'uploaded' });
  });
});

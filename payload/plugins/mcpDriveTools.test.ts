import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PayloadRequest } from 'payload';

const linking = {
  getDriveEntry: vi.fn(),
  listDriveFolder: vi.fn(),
  shareDriveFilePublicly: vi.fn(),
};
vi.mock('@/lib/google-drive/linking', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/google-drive/linking')>()),
  ...linking,
}));
vi.mock('@/lib/google-drive/auth', () => ({ getDrive: vi.fn() }));
vi.mock('@/lib/sentry/cli-client', () => ({ captureException: vi.fn() }));

const { handleLinkDriveDocument, handleListDriveFolder } = await import('./mcpDriveTools');

const ID = '1AbCdEfGhIjKlMnOpQrStUvWxYz012345';
const find = vi.fn();
const create = vi.fn();
const makeReq = (user: unknown = { id: 'u1' }) =>
  ({ user, payload: { find, create } }) as unknown as PayloadRequest;
const out = (r: { content: Array<{ text: string }> }) => r.content[0].text;

const pdfEntry = (overrides = {}) => ({
  id: ID,
  name: 'Annual Report.pdf',
  mimeType: 'application/pdf',
  isFolder: false,
  size: 1200,
  isPublic: true,
  linkable: true,
  trashed: false,
  ...overrides,
});

const httpError = (status: number) => Object.assign(new Error(`HTTP ${status}`), { status });

beforeEach(() => {
  vi.clearAllMocks();
  find.mockResolvedValue({ docs: [] });
  create.mockImplementation(async ({ data }) => ({
    id: 'doc-1',
    title: data.title,
    url: `https://drive.google.com/uc?export=download&id=${data.filename}`,
    source: 'linked',
  }));
  linking.getDriveEntry.mockResolvedValue(pdfEntry());
});

describe('handleLinkDriveDocument', () => {
  it('creates a linked entry pointing at the existing file, without uploading', async () => {
    const req = makeReq();
    const result = await handleLinkDriveDocument(
      { file: `https://drive.google.com/file/d/${ID}/view` },
      req
    );

    expect(out(result)).toContain('stays in its Drive folder');
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'documents',
        data: expect.objectContaining({
          title: 'Annual Report',
          folder: 'general',
          filename: ID,
          mimeType: 'application/pdf',
          filesize: 1200,
        }),
        context: { linkDriveDocument: true },
        req,
      })
    );
    expect(create.mock.calls[0][0]).not.toHaveProperty('file');
    expect(linking.shareDriveFilePublicly).not.toHaveBeenCalled();
  });

  it('returns the existing entry instead of linking twice', async () => {
    find.mockResolvedValue({ docs: [{ id: 'old', title: 'Report', url: 'u' }] });
    const result = await handleLinkDriveDocument({ file: ID }, makeReq());
    expect(out(result)).toContain('Already linked');
    expect(create).not.toHaveBeenCalled();
  });

  it('refuses a private file unless makePublic is set', async () => {
    linking.getDriveEntry.mockResolvedValue(pdfEntry({ isPublic: false }));

    const refused = await handleLinkDriveDocument({ file: ID }, makeReq());
    expect(out(refused)).toContain('not shared as "anyone with the link"');
    expect(create).not.toHaveBeenCalled();

    await handleLinkDriveDocument({ file: ID, makePublic: true }, makeReq());
    expect(linking.shareDriveFilePublicly).toHaveBeenCalledWith(ID);
    expect(create).toHaveBeenCalled();
  });

  it('explains when the account cannot share the file', async () => {
    linking.getDriveEntry.mockResolvedValue(pdfEntry({ isPublic: false }));
    linking.shareDriveFilePublicly.mockRejectedValue(httpError(403));
    const result = await handleLinkDriveDocument({ file: ID, makePublic: true }, makeReq());
    expect(out(result)).toContain('no edit rights');
    expect(create).not.toHaveBeenCalled();
  });

  it('rejects files it cannot see, trashed files and unsupported types', async () => {
    linking.getDriveEntry.mockRejectedValueOnce(httpError(404));
    expect(out(await handleLinkDriveDocument({ file: ID }, makeReq()))).toContain(
      'not shared with the HawkStars Google account'
    );

    linking.getDriveEntry.mockResolvedValueOnce(pdfEntry({ trashed: true }));
    expect(out(await handleLinkDriveDocument({ file: ID }, makeReq()))).toContain('bin');

    linking.getDriveEntry.mockResolvedValueOnce(
      pdfEntry({ linkable: false, reason: 'Google Docs file' })
    );
    expect(out(await handleLinkDriveDocument({ file: ID }, makeReq()))).toContain(
      'cannot be linked'
    );

    expect(create).not.toHaveBeenCalled();
  });

  it('requires a signed-in API key and a valid Drive reference', async () => {
    expect(out(await handleLinkDriveDocument({ file: ID }, makeReq(null)))).toContain(
      'authenticated'
    );
    expect(out(await handleLinkDriveDocument({ file: 'report.pdf' }, makeReq()))).toContain(
      'not a Drive file ID or link'
    );
  });
});

describe('handleListDriveFolder', () => {
  it('lists a folder from a link', async () => {
    linking.listDriveFolder.mockResolvedValue({
      entries: [
        pdfEntry(),
        { id: 'sub', name: 'Sub', isFolder: true, mimeType: 'x', isPublic: false, linkable: false },
      ],
    });
    const result = await handleListDriveFolder(
      { folder: `https://drive.google.com/drive/folders/${ID}` },
      makeReq()
    );
    expect(linking.listDriveFolder).toHaveBeenCalledWith(ID, expect.any(Object));
    const parsed = JSON.parse(out(result));
    expect(parsed.count).toBe(2);
    expect(parsed.entries[1]).toEqual({ id: 'sub', name: 'Sub', type: 'folder' });
  });

  it('defaults to the My Drive root', async () => {
    linking.listDriveFolder.mockResolvedValue({ entries: [] });
    await handleListDriveFolder({}, makeReq());
    expect(linking.listDriveFolder).toHaveBeenCalledWith('root', expect.any(Object));
  });
});

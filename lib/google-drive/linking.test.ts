import { beforeEach, describe, expect, it, vi } from 'vitest';

const drive = {
  files: { list: vi.fn(), get: vi.fn() },
  permissions: { create: vi.fn() },
};
vi.mock('./auth', () => ({ getDrive: () => drive }));
vi.mock('@/lib/sentry/cli-client', () => ({ captureException: vi.fn() }));

const { parseDriveId, listDriveFolder, getDriveEntry } = await import('./linking');

const ID = '1AbCdEfGhIjKlMnOpQrStUvWxYz012345';

beforeEach(() => vi.clearAllMocks());

describe('parseDriveId', () => {
  it.each([
    [ID, ID],
    [`https://drive.google.com/file/d/${ID}/view?usp=sharing`, ID],
    [`https://drive.google.com/drive/folders/${ID}`, ID],
    [`https://drive.google.com/drive/u/0/folders/${ID}?hl=pt`, ID],
    [`https://drive.google.com/uc?export=download&id=${ID}`, ID],
    [`https://docs.google.com/document/d/${ID}/edit`, ID],
  ])('reads %s', (input, expected) => {
    expect(parseDriveId(input)).toBe(expected);
  });

  it.each(['report.pdf', 'https://example.com/file/d/' + ID, 'not a link', ''])(
    'rejects %s',
    (input) => {
      expect(parseDriveId(input)).toBeUndefined();
    }
  );
});

describe('listDriveFolder', () => {
  it('lists across shared drives and flags what can be linked', async () => {
    drive.files.list.mockResolvedValue({
      data: {
        nextPageToken: 'next',
        files: [
          { id: 'f1', name: 'Sub', mimeType: 'application/vnd.google-apps.folder' },
          {
            id: 'f2',
            name: 'Report.pdf',
            mimeType: 'application/pdf',
            size: '1200',
            permissionIds: ['anyoneWithLink', '123'],
          },
          { id: 'f3', name: 'Notes', mimeType: 'application/vnd.google-apps.document' },
          { id: 'f4', name: 'photo.jpg', mimeType: 'image/jpeg' },
        ],
      },
    });

    const { entries, nextPageToken } = await listDriveFolder(ID);

    expect(drive.files.list).toHaveBeenCalledWith(
      expect.objectContaining({
        q: `'${ID}' in parents and trashed=false`,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      })
    );
    expect(nextPageToken).toBe('next');
    expect(entries.map((e) => [e.id, e.linkable, e.isPublic])).toEqual([
      ['f1', false, false],
      ['f2', true, true],
      ['f3', false, false],
      ['f4', false, false],
    ]);
    expect(entries[1].size).toBe(1200);
    expect(entries[2].reason).toContain('Export it');
  });
});

describe('getDriveEntry', () => {
  it('reports trashed files', async () => {
    drive.files.get.mockResolvedValue({
      data: { id: ID, name: 'a.pdf', mimeType: 'application/pdf', trashed: true },
    });
    const entry = await getDriveEntry(ID);
    expect(entry.trashed).toBe(true);
    expect(drive.files.get).toHaveBeenCalledWith(
      expect.objectContaining({ supportsAllDrives: true })
    );
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HandleDelete, HandleUpload } from '@payloadcms/plugin-cloud-storage/types';

const drive = {
  files: {
    list: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    update: vi.fn(),
  },
  permissions: {
    create: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock('./auth', () => ({ getDrive: () => drive }));
vi.mock('@/lib/sentry/cli-client', () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));

const {
  googleDriveAdapter,
  generateGoogleDriveURL,
  moveGoogleDriveFile,
  __resetGoogleDriveFolderCache,
} = await import('./adapter');

const ROOT = 'root';
const FILE_ID = 'abcdefghijklmnopqrstuvwxyz012345';

const uploadArgs = (folder?: string) =>
  ({
    data: { folder },
    file: {
      buffer: Buffer.from('hello'),
      filename: 'report.pdf',
      filesize: 5,
      mimeType: 'application/pdf',
    },
  }) as unknown as Parameters<HandleUpload>[0];

const deleteArgs = (filename: string) => ({ filename }) as unknown as Parameters<HandleDelete>[0];

const httpError = (status: number) => Object.assign(new Error(`HTTP ${status}`), { status });

beforeEach(() => {
  vi.clearAllMocks();
  __resetGoogleDriveFolderCache();
  drive.files.list.mockResolvedValue({ data: { files: [{ id: 'folder-1', name: 'general' }] } });
  drive.files.create.mockResolvedValue({ data: { id: FILE_ID, size: '5' } });
  drive.permissions.create.mockResolvedValue({});
  drive.files.delete.mockResolvedValue({});
});

describe('handleUpload', () => {
  it('scopes the folder lookup to the My Drive root and returns the Drive ID as filename', async () => {
    const result = await googleDriveAdapter().handleUpload(uploadArgs('general'));

    expect(drive.files.list.mock.calls[0][0].q).toContain(`'${ROOT}' in parents`);
    expect(drive.files.create).toHaveBeenCalledWith(
      expect.objectContaining({ requestBody: { name: 'report.pdf', parents: ['folder-1'] } })
    );
    expect(result).toEqual({ filename: FILE_ID, filesize: 5 });
  });

  it('creates a missing folder under the root, once, for concurrent uploads', async () => {
    drive.files.list.mockResolvedValue({ data: { files: [] } });
    drive.files.create.mockImplementation(async ({ requestBody }) =>
      requestBody.mimeType === 'application/vnd.google-apps.folder'
        ? { data: { id: 'new-folder' } }
        : { data: { id: FILE_ID, size: '5' } }
    );

    const adapter = googleDriveAdapter();
    await Promise.all([
      adapter.handleUpload(uploadArgs('reports')),
      adapter.handleUpload(uploadArgs('reports')),
      adapter.handleUpload(uploadArgs('reports')),
    ]);

    const folderCreates = drive.files.create.mock.calls.filter(
      ([args]) => args.requestBody.mimeType === 'application/vnd.google-apps.folder'
    );
    expect(drive.files.list).toHaveBeenCalledTimes(1);
    expect(folderCreates).toHaveLength(1);
    expect(folderCreates[0][0].requestBody.parents).toEqual([ROOT]);
  });

  it('deletes the uploaded file when sharing it fails, and rethrows', async () => {
    drive.permissions.create.mockRejectedValue(new Error('share failed'));

    await expect(googleDriveAdapter().handleUpload(uploadArgs())).rejects.toThrow('share failed');
    expect(drive.files.delete).toHaveBeenCalledWith({ fileId: FILE_ID });
  });

  it('does not cache a failed folder lookup', async () => {
    drive.files.list.mockRejectedValueOnce(new Error('boom'));
    await expect(googleDriveAdapter().handleUpload(uploadArgs())).rejects.toThrow('boom');

    await googleDriveAdapter().handleUpload(uploadArgs());
    expect(drive.files.list).toHaveBeenCalledTimes(2);
  });
});

describe('handleDelete', () => {
  it('skips legacy filenames that are not Drive IDs', async () => {
    await googleDriveAdapter().handleDelete(deleteArgs('report.pdf'));
    expect(drive.files.delete).not.toHaveBeenCalled();
  });

  it('treats an already-missing file as deleted', async () => {
    drive.files.delete.mockRejectedValue(httpError(404));
    await googleDriveAdapter().handleDelete(deleteArgs(FILE_ID));
    expect(drive.permissions.delete).not.toHaveBeenCalled();
  });

  it('revokes the public link when the delete fails', async () => {
    drive.files.delete.mockRejectedValue(httpError(500));
    drive.permissions.delete.mockResolvedValue({});

    await googleDriveAdapter().handleDelete(deleteArgs(FILE_ID));
    expect(drive.permissions.delete).toHaveBeenCalledWith({
      fileId: FILE_ID,
      permissionId: 'anyoneWithLink',
    });
  });
});

describe('moveGoogleDriveFile', () => {
  it('moves the file into the target folder', async () => {
    drive.files.list.mockResolvedValue({ data: { files: [{ id: 'events-id', name: 'events' }] } });
    drive.files.get.mockResolvedValue({ data: { parents: ['general-id'] } });

    await moveGoogleDriveFile(FILE_ID, 'events');
    expect(drive.files.update).toHaveBeenCalledWith(
      expect.objectContaining({
        fileId: FILE_ID,
        addParents: 'events-id',
        removeParents: 'general-id',
      })
    );
  });

  it('does nothing when the file is already there', async () => {
    drive.files.list.mockResolvedValue({ data: { files: [{ id: 'events-id', name: 'events' }] } });
    drive.files.get.mockResolvedValue({ data: { parents: ['events-id'] } });

    await moveGoogleDriveFile(FILE_ID, 'events');
    expect(drive.files.update).not.toHaveBeenCalled();
  });
});

describe('generateGoogleDriveURL', () => {
  it('builds a download URL for a Drive ID', () => {
    expect(generateGoogleDriveURL(FILE_ID)).toBe(
      `https://drive.google.com/uc?export=download&id=${FILE_ID}`
    );
  });

  it('returns an empty string for non-IDs', () => {
    expect(generateGoogleDriveURL('report.pdf')).toBe('');
    expect(generateGoogleDriveURL('')).toBe('');
  });
});

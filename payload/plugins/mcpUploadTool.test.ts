import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PayloadRequest } from 'payload';

vi.mock('@/lib/sentry/cli-client', () => ({ captureException: vi.fn() }));

const { decodeBase64Upload, handleUploadFile, MAX_UPLOAD_BYTES } = await import('./mcpUploadTool');

const create = vi.fn();
const makeReq = (user: unknown = { id: 'u1' }) =>
  ({ user, payload: { create } }) as unknown as PayloadRequest;

const PDF_BASE64 = Buffer.from('%PDF-1.4 hello').toString('base64');
const resultText = (r: { content: Array<{ text: string }> }) => r.content[0].text;

beforeEach(() => {
  vi.clearAllMocks();
  create.mockResolvedValue({ id: 'doc-1', filename: 'drive-id', url: 'https://example/x' });
});

describe('decodeBase64Upload', () => {
  it('decodes plain base64 and data URLs', () => {
    expect(decodeBase64Upload(PDF_BASE64).buffer.toString()).toBe('%PDF-1.4 hello');
    const fromDataUrl = decodeBase64Upload(`data:application/pdf;base64,${PDF_BASE64}`);
    expect(fromDataUrl.dataUrlMimeType).toBe('application/pdf');
    expect(fromDataUrl.buffer.toString()).toBe('%PDF-1.4 hello');
  });

  it('rejects invalid base64', () => {
    expect(() => decodeBase64Upload('not base64!!')).toThrow('not valid base64');
  });

  it('rejects files over the limit', () => {
    const tooBig = 'A'.repeat(Math.ceil(((MAX_UPLOAD_BYTES + 10) * 4) / 3));
    expect(() => decodeBase64Upload(tooBig)).toThrow('limit');
  });
});

describe('handleUploadFile', () => {
  it('creates a document with access control enforced', async () => {
    const req = makeReq();
    const result = await handleUploadFile(
      { collection: 'documents', filename: 'report.pdf', base64: PDF_BASE64, title: 'Report' },
      req
    );

    expect(resultText(result)).toContain('doc-1');
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'documents',
        data: { title: 'Report', folder: 'general' },
        overrideAccess: false,
        req,
        file: expect.objectContaining({ mimetype: 'application/pdf', name: 'report.pdf' }),
      })
    );
  });

  it('requires alt for media and title for documents', async () => {
    const media = await handleUploadFile(
      { collection: 'media', filename: 'a.png', base64: PDF_BASE64 },
      makeReq()
    );
    const doc = await handleUploadFile(
      { collection: 'documents', filename: 'a.pdf', base64: PDF_BASE64 },
      makeReq()
    );
    expect(resultText(media)).toContain('`alt` is required');
    expect(resultText(doc)).toContain('`title` is required');
    expect(create).not.toHaveBeenCalled();
  });

  it('refuses without an authenticated user', async () => {
    const result = await handleUploadFile(
      { collection: 'media', filename: 'a.png', base64: PDF_BASE64, alt: 'x' },
      makeReq(null)
    );
    expect(resultText(result)).toContain('authenticated');
    expect(create).not.toHaveBeenCalled();
  });

  it('rejects unknown extensions and missing extensions', async () => {
    const unknown = await handleUploadFile(
      { collection: 'documents', filename: 'run.exe', base64: PDF_BASE64, title: 't' },
      makeReq()
    );
    const missing = await handleUploadFile(
      { collection: 'documents', filename: 'report', base64: PDF_BASE64, title: 't' },
      makeReq()
    );
    expect(resultText(unknown)).toContain('unsupported file extension');
    expect(resultText(missing)).toContain('must include an extension');
  });

  it('returns Payload errors as tool output instead of throwing', async () => {
    create.mockRejectedValue(new Error('This file type is not allowed'));
    const result = await handleUploadFile(
      { collection: 'media', filename: 'a.png', base64: PDF_BASE64, alt: 'x' },
      makeReq()
    );
    expect(resultText(result)).toContain('This file type is not allowed');
  });
});

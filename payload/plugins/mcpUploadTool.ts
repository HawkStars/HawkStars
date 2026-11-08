import type { MCPPluginConfig } from '@payloadcms/plugin-mcp';
import type { PayloadRequest } from 'payload';
import { z } from 'zod';
import { captureException } from '@/lib/sentry/cli-client';

type MCPTool = NonNullable<NonNullable<MCPPluginConfig['mcp']>['tools']>[number];
type ToolResult = { content: Array<{ type: 'text'; text: string }> };

/**
 * Largest decoded file the tool accepts. Base64 adds ~33%, so a 10 MB file is a ~13.4 MB
 * request body — keep Nginx's `client_max_body_size` above that on the VPS, or requests are
 * cut off before they reach the app.
 */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  csv: 'text/csv',
};

const DOCUMENT_FOLDERS = ['general', 'projects', 'events', 'reports'] as const;

const parameters = {
  collection: z
    .enum(['media', 'documents'])
    .describe(
      '"media" for images (stored on Cloudinary), "documents" for files (stored on Google Drive).'
    ),
  filename: z
    .string()
    .min(3)
    .max(200)
    .describe(
      'File name including its extension, e.g. "annual-report-2025.pdf" or "team-photo.jpg".'
    ),
  base64: z
    .string()
    .min(1)
    .describe(
      'The file contents encoded as base64. A "data:<mime>;base64," prefix is accepted. ' +
        `Maximum ${MAX_UPLOAD_BYTES / 1024 / 1024} MB after decoding.`
    ),
  mimeType: z
    .string()
    .optional()
    .describe('Optional MIME type. Inferred from the filename extension when omitted.'),
  alt: z
    .string()
    .optional()
    .describe('Required for media: describes the image for screen readers.'),
  title: z.string().optional().describe('Required for documents: a descriptive title.'),
  folder: z
    .enum(DOCUMENT_FOLDERS)
    .optional()
    .describe('Documents only: Drive folder to file it under. Defaults to "general".'),
  description: z.string().optional().describe('Documents only: optional description.'),
};

type UploadArgs = {
  collection: 'media' | 'documents';
  filename: string;
  base64: string;
  mimeType?: string;
  alt?: string;
  title?: string;
  folder?: (typeof DOCUMENT_FOLDERS)[number];
  description?: string;
};

const text = (message: string): ToolResult => ({ content: [{ type: 'text', text: message }] });

/**
 * Decode a base64 payload (optionally a data URL) into a Buffer, rejecting anything that is not
 * valid base64 or is over the size limit. Throws an Error with a message safe to show the caller.
 */
export function decodeBase64Upload(input: string): { buffer: Buffer; dataUrlMimeType?: string } {
  let payload = input.trim();
  let dataUrlMimeType: string | undefined;

  const dataUrl = /^data:([^;,]+)?(?:;[^,]*)?;base64,/i.exec(payload);
  if (dataUrl) {
    dataUrlMimeType = dataUrl[1]?.toLowerCase();
    payload = payload.slice(dataUrl[0].length);
  }

  payload = payload.replace(/\s+/g, '');
  // Reject before decoding: Buffer.from silently skips invalid characters.
  if (!payload || !/^[A-Za-z0-9+/_-]+={0,2}$/.test(payload)) {
    throw new Error('`base64` is not valid base64.');
  }

  // Cheap upper bound before allocating the buffer.
  if (Math.floor((payload.length * 3) / 4) > MAX_UPLOAD_BYTES + 3) {
    throw new Error(`File is larger than the ${MAX_UPLOAD_BYTES / 1024 / 1024} MB limit.`);
  }

  const buffer = Buffer.from(payload, 'base64');
  if (buffer.length === 0) throw new Error('Decoded file is empty.');
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(`File is larger than the ${MAX_UPLOAD_BYTES / 1024 / 1024} MB limit.`);
  }
  return { buffer, dataUrlMimeType };
}

/**
 * Create a media or documents entry from base64 file contents.
 *
 * Goes through `payload.create` with `overrideAccess: false` and the API key's user on `req`, so
 * the collection's own access rules, its `mimeTypes` list and the storage adapters (Cloudinary
 * compression/rename, Drive folder + public link) all apply exactly as for an admin upload.
 */
export async function handleUploadFile(args: UploadArgs, req: PayloadRequest): Promise<ToolResult> {
  const { collection, filename } = args;

  if (!req.user) return text('Error: this tool requires an authenticated API key.');

  const extension = /\.([a-z0-9]+)$/i.exec(filename)?.[1]?.toLowerCase();
  if (!extension) return text('Error: `filename` must include an extension, e.g. "report.pdf".');

  let buffer: Buffer;
  let dataUrlMimeType: string | undefined;
  try {
    ({ buffer, dataUrlMimeType } = decodeBase64Upload(args.base64));
  } catch (error) {
    return text(`Error: ${(error as Error).message}`);
  }

  const mimetype = args.mimeType || dataUrlMimeType || MIME_BY_EXTENSION[extension];
  if (!mimetype) return text(`Error: unsupported file extension ".${extension}".`);

  let data: Record<string, unknown>;
  if (collection === 'media') {
    if (!args.alt?.trim()) return text('Error: `alt` is required for media.');
    data = { alt: args.alt.trim() };
  } else {
    if (!args.title?.trim()) return text('Error: `title` is required for documents.');
    data = {
      title: args.title.trim(),
      folder: args.folder ?? 'general',
      ...(args.description ? { description: args.description } : {}),
    };
  }

  try {
    const doc = await req.payload.create({
      collection,
      data: data as never,
      file: { data: buffer, mimetype, name: filename, size: buffer.length },
      overrideAccess: false,
      req,
    });

    const {
      id,
      filename: storedFilename,
      url,
    } = doc as {
      id: string;
      filename?: string | null;
      url?: string | null;
    };
    return text(
      `Uploaded to "${collection}".\n` +
        JSON.stringify({ id, filename: storedFilename, url }, null, 2)
    );
  } catch (error) {
    captureException(error, { extra: { collection, filename, size: buffer.length } });
    return text(`Error uploading to "${collection}": ${(error as Error).message}`);
  }
}

export const uploadFileTool: MCPTool = {
  name: 'uploadFile',
  description:
    'Upload a file from its base64-encoded contents. Use collection "media" for images ' +
    '(JPEG, PNG, WebP, AVIF, GIF; requires `alt`) or "documents" for PDF, Word, Excel, ' +
    'PowerPoint or CSV files (requires `title`, optional `folder` and `description`). ' +
    `Maximum ${MAX_UPLOAD_BYTES / 1024 / 1024} MB. Prefer createMedia/createDocuments with a ` +
    '`url` when the file is already online — it avoids sending the whole file through MCP. ' +
    'Returns the new entry id and its public URL.',
  parameters: parameters as unknown as MCPTool['parameters'],
  handler: (args, req) => handleUploadFile(args as UploadArgs, req),
};

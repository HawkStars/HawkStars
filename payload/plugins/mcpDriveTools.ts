import type { PayloadRequest } from 'payload';
import { z } from 'zod';
import { captureException } from '@/lib/sentry/cli-client';
import { getErrorStatus } from '@/lib/google-drive/adapter';
import {
  getDriveEntry,
  listDriveFolder,
  parseDriveId,
  shareDriveFilePublicly,
} from '@/lib/google-drive/linking';
import { LINK_DRIVE_DOCUMENT_CONTEXT } from '@/payload/hooks/setDocumentSource';
import { text, type MCPTool, type ToolResult } from './mcpToolUtils';

const DOCUMENT_FOLDERS = ['general', 'projects', 'events', 'reports'] as const;

const NOT_REACHABLE =
  'Google Drive cannot find it, or it is not shared with the HawkStars Google account. ' +
  'Share the file or its folder with that account, then try again.';

// ---------------------------------------------------------------------------------------------
// listDriveFolder
// ---------------------------------------------------------------------------------------------

type ListArgs = { folder?: string; pageToken?: string; pageSize?: number };

export async function handleListDriveFolder(
  args: ListArgs,
  req: PayloadRequest
): Promise<ToolResult> {
  if (!req.user) return text('Error: this tool requires an authenticated API key.');

  const folderInput = args.folder?.trim() || 'root';
  const folderId = folderInput === 'root' ? 'root' : parseDriveId(folderInput);
  if (!folderId) return text('Error: `folder` is not a Drive folder ID or link.');

  try {
    const { entries, nextPageToken } = await listDriveFolder(folderId, {
      pageToken: args.pageToken,
      pageSize: args.pageSize,
    });

    return text(
      JSON.stringify(
        {
          folder: folderId,
          count: entries.length,
          ...(nextPageToken ? { nextPageToken } : {}),
          entries: entries.map(
            ({ id, name, mimeType, isFolder, size, isPublic, linkable, reason }) => ({
              id,
              name,
              ...(isFolder ? { type: 'folder' } : { mimeType, size, isPublic, linkable }),
              ...(reason && !isFolder ? { reason } : {}),
            })
          ),
        },
        null,
        2
      )
    );
  } catch (error) {
    const status = getErrorStatus(error);
    if (status === 404 || status === 403) return text(`Error: ${NOT_REACHABLE}`);
    captureException(error, { extra: { folderId } });
    return text(`Error listing Drive folder: ${(error as Error).message}`);
  }
}

export const listDriveFolderTool: MCPTool = {
  name: 'listDriveFolder',
  description:
    'List the files and subfolders inside a Google Drive folder the HawkStars account can access, ' +
    'to find files to link as website documents without copying them. Pass a folder ID or link ' +
    "(omit for the account's My Drive root). Each file shows whether it is `linkable` (allowed " +
    'type: PDF, Word, Excel, PowerPoint, CSV) and `isPublic` (shared as "anyone with the link"). ' +
    'Google Docs/Sheets/Slides are not linkable until exported. Use `nextPageToken` for more ' +
    'results. Then call linkDriveDocument with a file id.',
  parameters: {
    folder: z
      .string()
      .optional()
      .describe('Drive folder ID or link (e.g. https://drive.google.com/drive/folders/<id>).'),
    pageToken: z.string().optional().describe('`nextPageToken` from a previous call.'),
    pageSize: z.number().int().min(1).max(200).optional().describe('Default 100.'),
  } as unknown as MCPTool['parameters'],
  handler: (args, req) => handleListDriveFolder(args as ListArgs, req),
};

// ---------------------------------------------------------------------------------------------
// linkDriveDocument
// ---------------------------------------------------------------------------------------------

type LinkArgs = {
  file: string;
  title?: string;
  folder?: (typeof DOCUMENT_FOLDERS)[number];
  description?: string;
  makePublic?: boolean;
};

const stripExtension = (name: string) => name.replace(/\.[^/.]+$/, '');

/**
 * Create a Documents entry that points at an existing Drive file — no download, no copy.
 *
 * The entry is marked `source: 'linked'` (via `req.context`, which callers cannot set), so the
 * Drive adapter never deletes or moves the original file. `overrideAccess: true` is needed
 * because Payload strips a caller-supplied `filename` otherwise; the tool enforces the
 * collection's create rule (any signed-in account) itself by requiring `req.user`.
 */
export async function handleLinkDriveDocument(
  args: LinkArgs,
  req: PayloadRequest
): Promise<ToolResult> {
  if (!req.user) return text('Error: this tool requires an authenticated API key.');

  const fileId = parseDriveId(args.file);
  if (!fileId) return text('Error: `file` is not a Drive file ID or link.');

  let entry: Awaited<ReturnType<typeof getDriveEntry>>;
  try {
    entry = await getDriveEntry(fileId);
  } catch (error) {
    const status = getErrorStatus(error);
    if (status === 404 || status === 403) return text(`Error: ${NOT_REACHABLE}`);
    captureException(error, { extra: { fileId } });
    return text(`Error reading Drive file: ${(error as Error).message}`);
  }

  if (entry.trashed) return text(`Error: "${entry.name}" is in the Drive bin.`);
  if (!entry.linkable) return text(`Error: "${entry.name}" cannot be linked — ${entry.reason}.`);

  // Linking the same file twice would only create duplicate entries.
  const existing = await req.payload.find({
    collection: 'documents',
    where: { filename: { equals: fileId } },
    limit: 1,
    depth: 0,
    req,
  });
  if (existing.docs[0]) {
    const { id, title, url } = existing.docs[0];
    return text(
      `Already linked — no new entry created.\n${JSON.stringify({ id, title, url }, null, 2)}`
    );
  }

  if (!entry.isPublic) {
    if (!args.makePublic) {
      return text(
        `Error: "${entry.name}" is not shared as "anyone with the link", so website visitors could ` +
          'not download it. Share it that way in Drive, or call again with makePublic: true to have ' +
          'the server share it (needs edit rights on the file).'
      );
    }
    try {
      await shareDriveFilePublicly(fileId);
    } catch (error) {
      if (getErrorStatus(error) === 403) {
        return text(
          `Error: the HawkStars account cannot change sharing on "${entry.name}" (no edit rights). ` +
            'Ask the owner to share it as "anyone with the link", then link it again.'
        );
      }
      captureException(error, { extra: { fileId } });
      return text(`Error sharing Drive file: ${(error as Error).message}`);
    }
  }

  try {
    const doc = await req.payload.create({
      collection: 'documents',
      data: {
        title: args.title?.trim() || stripExtension(entry.name),
        folder: args.folder ?? 'general',
        ...(args.description ? { description: args.description } : {}),
        filename: fileId,
        mimeType: entry.mimeType,
        ...(entry.size ? { filesize: entry.size } : {}),
      },
      overrideAccess: true,
      context: { [LINK_DRIVE_DOCUMENT_CONTEXT]: true },
      req,
    });

    return text(
      `Linked "${entry.name}" — the file stays in its Drive folder.\n` +
        JSON.stringify({ id: doc.id, title: doc.title, url: doc.url, source: doc.source }, null, 2)
    );
  } catch (error) {
    captureException(error, { extra: { fileId } });
    return text(`Error creating document: ${(error as Error).message}`);
  }
}

export const linkDriveDocumentTool: MCPTool = {
  name: 'linkDriveDocument',
  description:
    "Add an existing Google Drive file to the website's documents WITHOUT copying it: the entry " +
    'points at the file where it already is, and deleting the entry never deletes the file. Pass a ' +
    'Drive file ID or link (find them with listDriveFolder). The file must be PDF, Word, Excel, ' +
    'PowerPoint or CSV and shared as "anyone with the link"; set makePublic: true to have the ' +
    'server share it (needs edit rights). Linking a file that is already linked returns the ' +
    'existing entry. Returns the entry id and public download URL.',
  parameters: {
    file: z
      .string()
      .min(1)
      .describe('Drive file ID or link (e.g. https://drive.google.com/file/d/<id>/view).'),
    title: z
      .string()
      .optional()
      .describe('Title shown on the website. Defaults to the file name without its extension.'),
    folder: z
      .enum(DOCUMENT_FOLDERS)
      .optional()
      .describe(
        'Website category for the entry (does not move the Drive file). Default "general".'
      ),
    description: z.string().optional().describe('Optional description.'),
    makePublic: z
      .boolean()
      .optional()
      .describe('Share the file as "anyone with the link" if it is not already. Default false.'),
  } as unknown as MCPTool['parameters'],
  handler: (args, req) => handleLinkDriveDocument(args as LinkArgs, req),
};

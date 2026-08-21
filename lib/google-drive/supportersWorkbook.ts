import ExcelJS from 'exceljs';
import { Readable } from 'stream';
import * as Sentry from '@sentry/nextjs';
import { getDrive } from './auth';

/**
 * Parses the crowdfunding supporters Excel file that lives on Google Drive and
 * marks rows as imported once they've been read, using the spreadsheet itself
 * as the source of truth for what has already been synced into Payload.
 *
 * Expected columns (header row, case-insensitive, in any order): "Name",
 * "Value". An "Imported" column is added automatically the first time this
 * runs and is set to TRUE on every row that has been synced — rows that
 * already have it set are skipped on subsequent runs, and new rows appended
 * below existing ones are picked up automatically.
 */

export type SupporterRow = {
  name: string;
  value: number;
};

const NAME_HEADER_PATTERN = /^name$/i;
const VALUE_HEADER_PATTERN = /^value$/i;
const IMPORTED_HEADER_PATTERN = /^imported$/i;
const TRUTHY_IMPORTED_VALUES = new Set(['true', 'yes', 'y', '1', 'x']);

function isTruthyImportedCell(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') return TRUTHY_IMPORTED_VALUES.has(value.trim().toLowerCase());
  return false;
}

async function downloadWorkbookBuffer(fileId: string): Promise<Buffer> {
  const drive = getDrive();
  const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
  return Buffer.from(response.data as ArrayBuffer);
}

async function uploadWorkbookBuffer(fileId: string, buffer: Buffer): Promise<void> {
  const drive = getDrive();
  await drive.files.update({
    fileId,
    media: {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      body: Readable.from(buffer),
    },
  });
}

export type ImportSupportersResult = {
  /** New rows read from the spreadsheet that have not been synced before. */
  newRows: SupporterRow[];
  /** Rows that had a Name/Value cell but failed validation (skipped, left unmarked so they can be fixed and retried). */
  skippedInvalidRowNumbers: number[];
};

/**
 * Downloads the workbook, extracts unimported supporter rows, hands them to
 * `onNewRows` (which should persist them into Payload), and — only once that
 * succeeds — marks the rows as imported and re-uploads the workbook back to
 * the same Drive file.
 *
 * The write-back happens strictly after `onNewRows` resolves: if persisting
 * to Payload fails, the sheet is left completely untouched so the run can be
 * retried later without any risk of a row being marked "Imported" without
 * actually having been saved.
 *
 * If there are no new rows to import, the file is left untouched (no
 * re-upload), so Drive's modifiedTime only changes when something happened.
 */
export async function importNewSupportersFromDrive(
  fileId: string,
  onNewRows: (rows: SupporterRow[]) => Promise<void>
): Promise<ImportSupportersResult> {
  const buffer = await downloadWorkbookBuffer(fileId);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error(`Supporters workbook (fileId ${fileId}) has no worksheets`);
  }

  const headerRow = worksheet.getRow(1);
  let nameCol: number | undefined;
  let valueCol: number | undefined;
  let importedCol: number | undefined;

  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    const header = String(cell.value ?? '').trim();
    if (NAME_HEADER_PATTERN.test(header)) nameCol = colNumber;
    else if (VALUE_HEADER_PATTERN.test(header)) valueCol = colNumber;
    else if (IMPORTED_HEADER_PATTERN.test(header)) importedCol = colNumber;
  });

  if (!nameCol || !valueCol) {
    throw new Error(
      `Supporters workbook (fileId ${fileId}) is missing a "Name" and/or "Value" header column`
    );
  }

  // First run: add the "Imported" tracking column so the document becomes
  // self-describing about what has already been synced.
  if (!importedCol) {
    importedCol = headerRow.cellCount + 1;
    headerRow.getCell(importedCol).value = 'Imported';
  }

  const newRows: SupporterRow[] = [];
  const skippedInvalidRowNumbers: number[] = [];
  // Cells to flip to "Imported" — only applied after `onNewRows` succeeds, so
  // a failed Payload write never leaves the sheet claiming a row was synced.
  const cellsToMarkImported: ExcelJS.Cell[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // header

    const importedCell = row.getCell(importedCol!);
    if (isTruthyImportedCell(importedCell.value)) return; // already synced

    const rawName = row.getCell(nameCol!).value;
    const rawValue = row.getCell(valueCol!).value;
    const name = typeof rawName === 'string' ? rawName.trim() : String(rawName ?? '').trim();
    const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);

    if (!name || !Number.isFinite(value) || value <= 0) {
      // Leave the row unmarked so it can be corrected in the sheet and picked
      // up on a future run, rather than silently losing it.
      if (rawName != null || rawValue != null) skippedInvalidRowNumbers.push(rowNumber);
      return;
    }

    newRows.push({ name, value });
    cellsToMarkImported.push(importedCell);
  });

  if (newRows.length > 0) {
    // Persist to Payload first. If this throws, we deliberately skip marking
    // rows / re-uploading — the caller can safely retry the whole run later.
    await onNewRows(newRows);

    cellsToMarkImported.forEach((cell) => {
      cell.value = true;
    });

    const outBuffer = Buffer.from(await workbook.xlsx.writeBuffer());
    try {
      await uploadWorkbookBuffer(fileId, outBuffer);
    } catch (error) {
      // The Payload write already succeeded at this point — a failure here
      // means the sheet will still show these rows as unimported next run,
      // which would re-create them as duplicate supporters. Flag loudly.
      Sentry.captureException(error, {
        extra: {
          fileId,
          newSupportersCount: newRows.length,
          note: 'Supporters were already saved to Payload before this re-upload failed — next run will likely duplicate them.',
        },
      });
      throw error;
    }
  }

  return { newRows, skippedInvalidRowNumbers };
}

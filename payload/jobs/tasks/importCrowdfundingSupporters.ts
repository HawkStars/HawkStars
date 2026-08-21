import type { TaskConfig } from 'payload';
import * as Sentry from '@sentry/nextjs';
import {
  importNewSupportersFromDrive,
  type SupporterRow,
} from '@/lib/google-drive/supportersWorkbook';

type ImportSupportersTaskIO = {
  input: Record<string, never>;
  output: { importedCount: number };
};

/**
 * Payload task that reads new crowdfunding contributions (name + value) from
 * an Excel file kept on Google Drive and adds them as entries in the
 * "Supporters" tab of the CrowdfundingSettings global — the array that
 * powers the public "Já Contamos com o Apoio de" donor wall.
 *
 * The spreadsheet is the source of truth for what's already been imported:
 * an "Imported" column is added to it automatically, and rows already
 * flagged there are skipped. New rows appended below existing ones (in the
 * same file, identified by GOOGLE_CROWDFUNDING_SUPPORTERS_FILE_ID) are picked
 * up on the next run.
 *
 * Imported rows are published immediately (not left as an unpublished
 * draft), and default to type "person" since the source sheet only has a
 * name and a value column, with no way to distinguish individuals from
 * entities.
 */
export const importCrowdfundingSupportersTask: TaskConfig<ImportSupportersTaskIO> = {
  slug: 'importCrowdfundingSupporters',
  label: 'Import Crowdfunding Supporters from Drive',
  handler: async ({ req }) => {
    const { payload } = req;
    const settings = await payload.findGlobal({ slug: 'settings' });
    const fileId = settings.crowdfundingFileId;

    if (!fileId) {
      throw new Error(
        'GOOGLE_CROWDFUNDING_SUPPORTERS_FILE_ID is not configured. Set it to the Google Drive file ID of the supporters spreadsheet.'
      );
    }

    let importedCount = 0;

    const { newRows, skippedInvalidRowNumbers } = await importNewSupportersFromDrive(
      fileId,
      async (rows: SupporterRow[]) => {
        const settings = await payload.findGlobal({ slug: 'crowdfunding-settings' });
        const existingSupporters = settings?.supporters ?? [];

        const supportersToAppend = rows.map((row) => ({
          name: row.name,
          value: row.value,
          type: 'person' as const,
        }));

        await payload.updateGlobal({
          slug: 'crowdfunding-settings',
          data: {
            supporters: [...existingSupporters, ...supportersToAppend],
          },
        });

        importedCount = rows.length;
      }
    );

    if (skippedInvalidRowNumbers.length > 0) {
      Sentry.captureMessage(
        `Crowdfunding supporters import: skipped ${skippedInvalidRowNumbers.length} row(s) with a missing/invalid Name or Value (row numbers: ${skippedInvalidRowNumbers.join(', ')}). They were left unmarked in the sheet so they can be fixed and retried.`,
        { level: 'warning' }
      );
    }

    payload.logger.info(
      `Crowdfunding supporters import: added ${newRows.length} new supporter(s) from Drive file ${fileId}.`
    );

    return { output: { importedCount } };
  },
  schedule: [
    {
      // Daily at 04:00 UTC — adjust to taste; the task is idempotent per run
      // (the sheet tracks what's already imported), so more frequent runs
      // are also safe if faster turnaround is needed.
      cron: '0 4 * * *',
      queue: 'default',
    },
  ],
};

import * as migration_20250528_remove_dropdown_version from './20250528_remove_dropdown_version';
import * as migration_20260718_000000_reset_activity_log from './20260718_000000_reset_activity_log';
import * as migration_20260718_152949_change_description_news_to_richtext from './20260718_152949_change_description_news_to_richtext';
import * as migration_20260719_000000_remove_content_status from './20260719_000000_remove_content_status';

// Payload runs these in array order, so this list must stay chronological by
// the migration name's timestamp — it previously ran 152949 before 000000 on
// the same day, which is out of order.
export const migrations = [
  {
    up: migration_20250528_remove_dropdown_version.up,
    down: migration_20250528_remove_dropdown_version.down,
    name: '20250528_remove_dropdown_version',
  },
  {
    up: migration_20260718_000000_reset_activity_log.up,
    down: migration_20260718_000000_reset_activity_log.down,
    name: '20260718_000000_reset_activity_log',
  },
  {
    up: migration_20260718_152949_change_description_news_to_richtext.up,
    down: migration_20260718_152949_change_description_news_to_richtext.down,
    name: '20260718_152949_change_description_news_to_richtext',
  },
  {
    up: migration_20260719_000000_remove_content_status.up,
    down: migration_20260719_000000_remove_content_status.down,
    name: '20260719_000000_remove_content_status',
  },
];

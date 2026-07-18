import * as migration_20250528_remove_dropdown_version from './20250528_remove_dropdown_version';
import * as migration_20260718_152949_change_description_news_to_richtext from './20260718_152949_change_description_news_to_richtext';

export const migrations = [
  {
    up: migration_20250528_remove_dropdown_version.up,
    down: migration_20250528_remove_dropdown_version.down,
    name: '20250528_remove_dropdown_version',
  },
  {
    up: migration_20260718_152949_change_description_news_to_richtext.up,
    down: migration_20260718_152949_change_description_news_to_richtext.down,
    name: '20260718_152949_change_description_news_to_richtext'
  },
];

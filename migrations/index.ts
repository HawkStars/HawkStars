import * as migration_20250528_remove_dropdown_version from './20250528_remove_dropdown_version';

export const migrations = [
  {
    up: migration_20250528_remove_dropdown_version.up,
    down: migration_20250528_remove_dropdown_version.down,
    name: '20250528_remove_dropdown_version',
  },
];

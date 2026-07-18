import * as migration_20260718_000000_reset_activity_log from './20260718_000000_reset_activity_log';

export const migrations = [
  {
    up: migration_20260718_000000_reset_activity_log.up,
    down: migration_20260718_000000_reset_activity_log.down,
    name: '20260718_000000_reset_activity_log',
  },
];

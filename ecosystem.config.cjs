// PM2 process definition for HawkStars (production, VPS).
//
// Runs Next.js directly instead of wrapping `npm start`. Wrapping npm means
// PM2 manages npm (which spawns `next` as a child); npm doesn't forward
// signals cleanly, so PM2 misreports child boot failures as SIGINT / code 254.
// Running the Next binary directly gives accurate exit codes and clean signals.
//
// `cwd` is pinned to an absolute path so a resurrected/reloaded process can
// never start from the wrong directory (the ENOENT `/root/package.json` bug).
module.exports = {
  apps: [
    {
      name: 'hawkstars',
      cwd: '/root/app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '20s', // boots dying faster than this count as "unstable"
      restart_delay: 2000,
      watch: false,
      ignore_watch: ['node_modules', '.next', '.git', 'logs', 'public'],
      log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

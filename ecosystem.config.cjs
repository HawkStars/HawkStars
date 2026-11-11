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
      // One instance on purpose. `utils/rateLimit.ts` keeps its counters in a
      // module-level Map, and `next.config.ts`'s `cacheMaxMemorySize` is a
      // per-process LRU — neither is shared between cluster workers. With two
      // workers every rate limit was effectively doubled (including
      // `rateLimitLogin`, the brute-force guard on /admin) and a `revalidateTag`
      // served by one worker left the other serving its own stale entry.
      // Raise this only after both move to a shared store.
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '20s', // boots dying faster than this count as "unstable"
      restart_delay: 2000,
      watch: false,
      ignore_watch: ['node_modules', '.next', '.git', 'logs', 'public'],
      // The VPS has 8 GB (≈6 GB available with Mongo running). The old 1024M cap
      // was sized for a 4 GB box and sat *below* the app's normal working set
      // (Next + Payload + the in-process `use cache` LRU), so PM2 recycled the
      // worker every couple of minutes — 2,600+ restarts, ~107s uptime. Every
      // recycle was a request stall (single instance) plus a cold cache, which
      // showed up as random 5–16s TTFB on any route, even fully static ones.
      //
      // The V8 heap is capped below the PM2 limit so the GC works hard before
      // PM2 ever has to kill anything; PM2 is now a leak backstop, not the
      // steady-state memory manager.
      node_args: '--max-old-space-size=2048',
      max_memory_restart: '2560M',
      // nginx holds proxied requests for up to 180s (`proxy_read_timeout`), so
      // PM2's 1.6s default cut in-flight requests on every reload.
      kill_timeout: 10000,
      listen_timeout: 10000,
      log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

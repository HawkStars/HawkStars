const customDateRangeQuery = () => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const nowIso = now.toISOString();

  return { startOfDay, endOfDay, now: nowIso };
};

export { customDateRangeQuery };

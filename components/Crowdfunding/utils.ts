export const getPercentage = (raised?: number | null, goal?: number | null) =>
  goal && goal > 0 ? Math.round(((raised ?? 0) / goal) * 100) : 0;

/**
 * The structural works start once the first €40,000 is raised (Global Village 2026
 * presentation, §3). Shown as a marker on the campaign bar when it falls inside it.
 */
export const WORKS_START_AMOUNT = 40000;

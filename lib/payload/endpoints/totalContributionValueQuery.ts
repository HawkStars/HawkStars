import { BasePayload, Where } from 'payload';

export type ContributionTotal = { sum: number; totalDocs: number };

/**
 * Total value of all confirmed contributions.
 *
 * Previously this loaded every confirmed contribution at Payload's default depth 2
 * (`limit: 0`, no `select`) and summed `value` in JavaScript, on every render of the
 * public transparency page — unbounded, and growing with each donation. It now
 * projects a single field and sums server-side.
 *
 * Returns a plain object; `sumContributionsHandler` wraps it for the REST route.
 * Deliberately does NOT call `connection()` — callers decide whether their route is
 * dynamic, which lets the cached server path stay cacheable.
 */
const totalContributionValueQuery = async ({
  payload,
}: {
  payload: BasePayload;
}): Promise<ContributionTotal> => {
  const where: Where = { is_confirmed: { equals: true } };

  const result = await payload.find({
    collection: 'contributions',
    where,
    limit: 0,
    depth: 0,
    select: { value: true },
  });

  const sum = result.docs.reduce((total, doc) => total + (doc.value || 0), 0);

  return { sum, totalDocs: result.totalDocs };
};

export default totalContributionValueQuery;

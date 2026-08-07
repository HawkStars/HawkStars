import { BasePayload, Where } from 'payload';
const totalContributioValueQuery = async ({
  payload,
}: {
  payload: BasePayload;
}): Promise<Response> => {
  const where: Where = { is_confirmed: { equals: true } };

  const result = await payload.find({
    collection: 'contributions',
    where,
    limit: 0,
  });

  if (result.totalDocs === 0) return new Response(JSON.stringify({ sum: 0 }));

  const sum = result.docs.reduce((total, doc) => total + (doc.value || 0), 0);
  return new Response(JSON.stringify({ sum, totalDocs: result.totalDocs }));
};

export default totalContributioValueQuery;

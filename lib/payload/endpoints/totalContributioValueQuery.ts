import { BasePayload, PayloadRequest } from 'payload';

const totalContributioValueQuery = async ({
  payload,
}: {
  payload: BasePayload;
}): Promise<Response> => {
  const result = await payload.find({
    collection: 'contributions',
  });

  if (result.totalDocs === 0) return new Response(JSON.stringify({ sum: 0 }));

  const sum = result.docs.reduce((total, doc) => total + (doc.value || 0), 0);
  return new Response(JSON.stringify({ sum }));
};

export default totalContributioValueQuery;

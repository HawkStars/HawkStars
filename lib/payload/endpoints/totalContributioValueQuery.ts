import { PayloadRequest } from 'payload';

const totalContributioValueQuery = async (req: PayloadRequest): Promise<Response> => {
  const result = await req.payload.find({
    collection: 'contributions',
  });

  const sum = result.docs.reduce((total, doc) => total + (doc.value || 0), 0);

  return new Response(JSON.stringify({ sum }));
};

export default totalContributioValueQuery;

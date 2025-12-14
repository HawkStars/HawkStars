import { getPayloadConfig } from '../server';

const getPartnersQuery = async () => {
  const payload = await getPayloadConfig();
  return await payload.find({
    collection: 'partners',
    sort: '-createdAt',
    limit: 1000,
  });
};

export { getPartnersQuery };

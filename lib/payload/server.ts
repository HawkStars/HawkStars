import 'server-only';

import { getPayload, type Payload } from 'payload';
import config from '@/payload.config';

// The mongoose adapter exposes its live connection here. readyState follows the
// mongoose convention: 0 = disconnected, 1 = connected, 2 = connecting,
// 3 = disconnecting.
type MongooseDB = Payload['db'] & {
  connection?: { readyState?: number };
};

export const getPayloadConfig = async (): Promise<Payload> => {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  // Guard against "MongoNotConnectedError: Client must be connected before
  // running operations". Payload closes the Mongo connection on HMR reload (dev)
  // and during process teardown/restart (prod), which can leave the cached
  // Payload instance pointing at a closed client. If the connection is fully
  // disconnected, re-establish it before handing the instance back.
  const connection = (payload.db as MongooseDB).connection;
  if (connection && connection.readyState === 0 && typeof payload.db.connect === 'function') {
    await payload.db.connect();
  }

  return payload;
};

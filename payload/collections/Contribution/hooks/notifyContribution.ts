import type { CollectionAfterChangeHook } from 'payload';
import type { Contribution } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

const formatValue = (value: Contribution['value']) =>
  typeof value === 'number' ? value.toFixed(2) : '0.00';

export const notifyContribution: CollectionAfterChangeHook<Contribution> = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  const donor = doc.donor || 'Anonymous';
  const value = formatValue(doc.value);

  if (operation === 'create') {
    await createNotification(req.payload, {
      collection: 'contributions',
      situation: 'create',
      title: `Contribution from ${donor}`,
      message: `A contribution of €${value} (${doc.contribution_type || 'Unknown type'}) has been received and is ${doc.is_confirmed ? 'confirmed' : 'pending confirmation'}.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  if (operation === 'update' && doc.is_confirmed === true && previousDoc?.is_confirmed === false) {
    await createNotification(req.payload, {
      collection: 'contributions',
      situation: 'update',
      title: `Contribution from ${donor}`,
      message: `The €${value} contribution from ${donor} has been confirmed.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  return doc;
};

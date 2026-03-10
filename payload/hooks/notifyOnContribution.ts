import type { CollectionAfterChangeHook } from 'payload';

export const notifyOnContribution: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  const { payload } = req;

  try {
    if (operation === 'create') {
      const donor = doc.donor || 'Anonymous';
      const value = typeof doc.value === 'number' ? doc.value.toFixed(2) : '0.00';

      await payload.create({
        collection: 'notifications',
        data: {
          title: `New contribution from ${donor}`,
          message: `A new contribution of €${value} (${doc.contribution_type || 'Unknown type'}) has been received and is ${doc.is_confirmed ? 'confirmed' : 'pending confirmation'}.`,
          type: 'contribution_created',
          read: false,
          link: `/admin/collections/contributions/${doc.id}`,
          relatedCollection: 'contributions',
          relatedDocId: String(doc.id),
        },
      });
    }

    // Notify when a contribution gets confirmed
    if (
      operation === 'update' &&
      doc.is_confirmed === true &&
      previousDoc?.is_confirmed === false
    ) {
      const donor = doc.donor || 'Anonymous';
      const value = typeof doc.value === 'number' ? doc.value.toFixed(2) : '0.00';

      await payload.create({
        collection: 'notifications',
        data: {
          title: `Contribution from ${donor} confirmed`,
          message: `The €${value} contribution from ${donor} has been confirmed.`,
          type: 'contribution_confirmed',
          read: false,
          link: `/admin/collections/contributions/${doc.id}`,
          relatedCollection: 'contributions',
          relatedDocId: String(doc.id),
        },
      });
    }
  } catch (error) {
    // Silently fail — notifications should never break the main operation
    console.error('Failed to create contribution notification:', error);
  }

  return doc;
};

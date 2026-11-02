import type { CollectionBeforeValidateHook } from 'payload';
import type { MemberProject } from '@/payload-types';
import { isAdminUser } from '@/payload/access/isAdminUser';

export const checkConfirmedByAdmin: CollectionBeforeValidateHook<MemberProject> = async ({
  data,
  operation,
  req,
}) => {
  if (!data) return data;

  if (operation === 'update') {
    const admin = isAdminUser(req.user);
    if (admin && data.is_confirmed === true) {
      return data;
    } else if (!admin && data.is_confirmed === true) {
      return { ...data, is_confirmed: false };
    }
  }

  return data;
};

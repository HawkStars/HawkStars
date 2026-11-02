import type { AccessArgs } from 'payload';
import type { User } from '@/payload-types';
import { isAdminUser } from './isAdminUser';

type isAdminAuthenticated = (args: AccessArgs<User>) => boolean;

export const authenticatedAdmin: isAdminAuthenticated = ({ req: { user } }) => isAdminUser(user);

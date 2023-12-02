import { Database } from '@/database.types';

type DatabaseEnums = Database['public']['Enums'];
type DatabaseTables = Database['public']['Tables'];

/**
 * Enums
 */

export type ContributionType = DatabaseEnums['ContributionType'];
export type MoneyMovementType = DatabaseEnums['MoneyMovementType'];
export type ProfileType = DatabaseEnums['ProfileType'];

/**
 * Tables
 */

export type Profile = DatabaseTables['profiles'];
export type OrganizationMovement = DatabaseTables['organization_movements'];
export type Contribution = DatabaseTables['contributions'];

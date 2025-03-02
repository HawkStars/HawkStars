import { Database } from '@/database.types';
import { Contribution } from '@/projects/sanity/sanity.types';

type DatabaseEnums = Database['public']['Enums'];
type DatabaseTables = Database['public']['Tables'];

/**
 * Enums
 */

export type MoneyMovementType = DatabaseEnums['MoneyMovementType'];

/**
 * Tables
 */

export type OrganizationMovements = DatabaseTables['organization_movements'];
export type Contributions = DatabaseTables['contributions'];

/** MODELS */

export type OrganizationMovement = OrganizationMovements['Row'];

export type ContributionType = Contribution['contribution_type'];

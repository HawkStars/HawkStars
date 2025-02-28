import { Database } from '@/database.types';

type DatabaseEnums = Database['public']['Enums'];
type DatabaseTables = Database['public']['Tables'];

/**
 * Enums
 */

export type ContributionType = DatabaseEnums['ContributionType'];
export type MoneyMovementType = DatabaseEnums['MoneyMovementType'];

/**
 * Tables
 */

export type OrganizationMovements = DatabaseTables['organization_movements'];
export type Contributions = DatabaseTables['contributions'];

/** MODELS */

export type OrganizationMovement = OrganizationMovements['Row'];
export type Contribution = Contributions['Row'];

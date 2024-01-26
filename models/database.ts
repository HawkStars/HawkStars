import { Database } from '@/database.types';

type DatabaseEnums = Database['public']['Enums'];
type DatabaseTables = Database['public']['Tables'];
type DatabaseCustomFunctions = Database['public']['Functions'];

/**
 * Enums
 */

export type ContributionType = DatabaseEnums['ContributionType'];
export type MoneyMovementType = DatabaseEnums['MoneyMovementType'];
export type ProfileType = DatabaseEnums['ProfileType'];

/**
 * Tables
 */

export type Profiles = DatabaseTables['profiles'];
export type OrganizationMovements = DatabaseTables['organization_movements'];
export type Contributions = DatabaseTables['contributions'];
export type ErasmusProjects = DatabaseTables['erasmus_projects'];
export type HawkEvents = DatabaseTables['hawk_events'];

/** MODELS */

export type Profile = Profiles['Row'];
export type OrganizationMovement = OrganizationMovements['Row'];
export type Contribution = Contributions['Row'];
export type ErasmusProject = ErasmusProjects['Row'];
export type HawkEvent = HawkEvents['Row'];

/**CUSTOM FUNCTIONS */
export type GetTotalContributions = DatabaseCustomFunctions['project_total_contributions'];

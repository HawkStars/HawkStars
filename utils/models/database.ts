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

/**
 * TABLES NAMES
 */

export const ERASMUS_PROJECT_TABLE_NAME = 'erasmus_projects' as const;
export const HAWK_EVENT_TABLE_NAME = 'hawk_events' as const;
export const ORGANIZATION_MOVEMENT_TABLE_NAME = 'organization_movements' as const;
export const CONTRIBUTION_TABLE_NAME = 'contributions' as const;
export const PROFILE_TABLE_NAME = 'profiles' as const;

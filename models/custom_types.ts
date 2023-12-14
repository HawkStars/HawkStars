import { ContributionType, MoneyMovementType } from './database';

const MoneyMovementLabel = {
  CREDIT: 'a',
  DEBIT: 'b',
} as OrganizationMovementLabelType;

type OrganizationMovementLabelType = {
  [key in MoneyMovementType]: string;
};

const ContributionLabel = {
  AUDITORIUM_CHAIR: 'contribute:options.auditorium_chair',
  BANK: 'contribute:options.bank_transfer',
  BUILDING_NAMING: 'contribute:options.building_naming',
  CRYPTO: 'contribute:options.crypto_transfer',
  LOUNGE_CHAIR: 'contribute:options.lounge_chair',
  // OFFICE_CHAIR: 'contribute:options.office_chair',
  OFFICE_CHAIR: 'home.title',
  SIMULATOR_CHAIR: 'contribute:options.simulator_chair',
  TRAINING_ROOM_NAMING: 'contribute:options.training_room_naming',
  WALL_NAME_COMPANY: 'contribute:options.wall_name_company',
  WALL_NAME_SINGULAR: 'contribute:options.wall_name_singular',
} as ContributonLabelType;

type ContributonLabelType = {
  [key in ContributionType]: string;
};

export { MoneyMovementLabel, ContributionLabel };

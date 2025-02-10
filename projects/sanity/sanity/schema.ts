import { type SchemaTypeDefinition } from 'sanity';
import { allSchemaTypes } from './types';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: allSchemaTypes,
};

import { SchemaPluginOptions } from 'sanity';
import { allSchemaTypes } from '.';

export const schema: SchemaPluginOptions = {
  types: allSchemaTypes,
  templates: undefined,
};

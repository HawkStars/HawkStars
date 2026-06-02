import type { Config, Field, Plugin } from 'payload';

const SHOW_INPUT_PATH = '@/payload/fields/showInput';

/**
 * Payload plugin that automatically adds the ShowInput afterInput component
 * to all localized text/textarea fields across collections and globals.
 * This shows the other locale's value beneath each localized field in the admin.
 */
export const showLocaleValuesPlugin: Plugin = (incomingConfig: Config): Config => {
  const config = { ...incomingConfig };

  // Process all collections
  if (config.collections) {
    config.collections = config.collections.map((collection) => ({
      ...collection,
      fields: injectIntoFields(collection.fields),
    }));
  }

  // Process all globals
  if (config.globals) {
    config.globals = config.globals.map((global) => ({
      ...global,
      fields: injectIntoFields(global.fields),
    }));
  }

  return config;
};

function injectIntoFields(fields: Field[]): Field[] {
  return fields.map((field) => injectIntoField(field));
}

function injectIntoField(field: Field): Field {
  // Recurse into structural field types
  switch (field.type) {
    case 'group':
    case 'collapsible':
      return { ...field, fields: injectIntoFields(field.fields) };

    case 'array':
      return { ...field, fields: injectIntoFields(field.fields) };

    case 'row':
      return { ...field, fields: injectIntoFields(field.fields) };

    case 'tabs': {
      return {
        ...field,
        tabs: field.tabs.map((tab) => ({
          ...tab,
          fields: injectIntoFields(tab.fields),
        })),
      };
    }

    case 'blocks': {
      return {
        ...field,
        blocks: field.blocks.map((block) => ({
          ...block,
          fields: injectIntoFields(block.fields),
        })),
      };
    }

    case 'text': {
      if (!field.localized) return field;

      const existing = field.admin?.components?.afterInput ?? [];
      if (Array.isArray(existing) && existing.includes(SHOW_INPUT_PATH)) return field;

      return {
        ...field,
        admin: {
          ...field.admin,
          components: {
            ...field.admin?.components,
            afterInput: [...(Array.isArray(existing) ? existing : []), SHOW_INPUT_PATH],
          },
        },
      };
    }

    case 'textarea': {
      if (!field.localized) return field;

      const existing = field.admin?.components?.afterInput ?? [];
      if (Array.isArray(existing) && existing.includes(SHOW_INPUT_PATH)) return field;

      return {
        ...field,
        admin: {
          ...field.admin,
          components: {
            ...field.admin?.components,
            afterInput: [...(Array.isArray(existing) ? existing : []), SHOW_INPUT_PATH],
          },
        },
      };
    }

    default:
      return field;
  }
}

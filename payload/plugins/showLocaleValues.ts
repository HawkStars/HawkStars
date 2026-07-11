import type { Config, Field, Plugin } from 'payload';

const SHOW_INPUT_PATH = '@/payload/fields/showInput';
const TRANSLATE_INPUT_PATH = '@/payload/fields/translateInput';

/** Components appended (in order) to the `afterInput` of every localized text field. */
const AFTER_INPUT_COMPONENTS = [SHOW_INPUT_PATH, TRANSLATE_INPUT_PATH];

/**
 * Payload plugin that automatically adds, to all localized text/textarea fields
 * across collections and globals:
 *   - ShowInput: shows the other locale's value beneath each field.
 *   - TranslateInput: a button that machine-translates the PT value into EN.
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
      const afterInput = mergeAfterInput(field.admin?.components?.afterInput);
      if (!afterInput) return field;
      return {
        ...field,
        admin: {
          ...field.admin,
          components: { ...field.admin?.components, afterInput },
        },
      };
    }

    case 'textarea': {
      if (!field.localized) return field;
      const afterInput = mergeAfterInput(field.admin?.components?.afterInput);
      if (!afterInput) return field;
      return {
        ...field,
        admin: {
          ...field.admin,
          components: { ...field.admin?.components, afterInput },
        },
      };
    }

    default:
      return field;
  }
}

/**
 * Build the merged `afterInput` array, appending any of our helper components
 * that are not already present. Returns `null` when nothing needs adding so
 * callers can keep the field untouched (idempotent across plugin re-runs).
 */
function mergeAfterInput(existing: unknown): string[] | null {
  const existingArr = Array.isArray(existing) ? (existing as string[]) : [];
  const toAdd = AFTER_INPUT_COMPONENTS.filter((component) => !existingArr.includes(component));
  if (toAdd.length === 0) return null;
  return [...existingArr, ...toAdd];
}

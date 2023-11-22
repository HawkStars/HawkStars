import sync from 'i18next-json-sync';
//or in ES5 world:
//const sync = require('i18next-json-sync').default;

//defaults are inline:
sync({
  /** Audit files in memory instead of changing them on the filesystem and
   * throw an error if any changes would be made */
  check: true,
  /** Glob pattern for the resource JSON files */
  files: '**/locales/*.json',
  /** An array of glob patterns to exclude from the files search */
  excludeFiles: ['**/node_modules/**'],
  /** Primary localization language. Other language files will be changed to match */
  primary: 'pt',
  /** Language files to create if they don't exist, e.g. ['es, 'pt-BR', 'fr'] */
  createResources: ['fr'],
  /** Space value used for JSON.stringify when writing JSON files to disk */
  space: 4,
  /** Line endings used when writing JSON files to disk. Either LF or CRLF */
  lineEndings: 'LF',
  /** Insert a final newline when writing JSON files to disk */
  finalNewline: false,
  /** Use empty string for new keys instead of the primary language value */
  newKeysEmpty: false,
});

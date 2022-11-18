import { capitalize, decapitalize } from '@js-to-lua/shared-utils';

const unhandledIdentifierCharactersRegex = /[^\w_]/;
const unhandledIdentifierCharactersRegexGlobal = /[^\w_]/g;

export const isValidIdentifier = (name: string): boolean =>
  !unhandledIdentifierCharactersRegex.test(name);
export const toValidIdentifier = (name: string): string =>
  name.replace(unhandledIdentifierCharactersRegexGlobal, '_');

export const capitalizeOnInvalidChars = (name: string): string =>
  decapitalize(
    name
      .split(unhandledIdentifierCharactersRegexGlobal)
      .map(capitalize)
      .join('')
  );

const unhandledIdentifierCharactersRegexString = '[^\\w_]';

export const isValidIdentifier = (name: string): boolean =>
  !new RegExp(unhandledIdentifierCharactersRegexString).test(name);
export const toValidIdentifier = (name: string): string =>
  name.replace(new RegExp(unhandledIdentifierCharactersRegexString, 'g'), '_');

export const removeInvalidChars = (name: string): string =>
  name.replace(new RegExp(unhandledIdentifierCharactersRegexString, 'g'), '');

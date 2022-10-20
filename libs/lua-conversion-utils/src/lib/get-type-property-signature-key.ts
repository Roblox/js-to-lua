import {
  identifier,
  isStringLiteral,
  LuaIdentifier,
  LuaNode,
  LuaStringLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';

import { reassignComments } from './comment';
import {
  getAlternativeExpressionExtra,
  getOriginalIdentifierNameExtra,
  isWithAlternativeStringLiteralExtras,
  isWithOriginalIdentifierNameExtras,
} from './extras';
import { luaReservedKeywords } from './identifier-roblox-keywords';
import { isValidIdentifier } from './valid-identifier';

export const getTypePropertySignatureKey = (
  key: LuaIdentifier | LuaStringLiteral
): LuaIdentifier | LuaStringLiteral => {
  if (isWithAlternativeStringLiteralExtras(key)) {
    const altStringLiteral = getAlternativeExpressionExtra(key);
    const propertySignatureKey =
      luaReservedKeywords.includes(altStringLiteral.value) ||
      !isValidIdentifier(altStringLiteral.value)
        ? altStringLiteral
        : reassignComments(identifier(altStringLiteral.value), key);

    return propertySignatureKey;
  }

  if (isWithOriginalIdentifierNameExtras(key)) {
    const keyName = getOriginalIdentifierNameExtra(key);
    const propertySignatureKey =
      luaReservedKeywords.includes(keyName) || !isValidIdentifier(keyName)
        ? reassignComments(stringLiteral(keyName), key)
        : reassignComments(identifier(keyName), key);

    return propertySignatureKey;
  }

  if (
    isStringLiteral(key) &&
    isValidIdentifier(key.value) &&
    !luaReservedKeywords.includes(key.value)
  ) {
    const literalValue = reassignComments<LuaIdentifier, LuaNode>(
      identifier(key.value),
      key
    );

    return literalValue;
  }

  return key;
};

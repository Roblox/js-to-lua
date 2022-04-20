import { LuaIdentifier } from '@js-to-lua/lua-types';

export const removeIdTypeAnnotation = (id: LuaIdentifier): LuaIdentifier => {
  const newIdentifier: LuaIdentifier = { ...id };
  delete newIdentifier.typeAnnotation;
  return newIdentifier;
};

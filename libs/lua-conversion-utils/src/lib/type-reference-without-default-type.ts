import { LuaTypeReference } from '@js-to-lua/lua-types';

export const typeReferenceWithoutDefaultType = (
  id: LuaTypeReference
): LuaTypeReference => {
  const newIdentifier: LuaTypeReference = { ...id };
  delete newIdentifier.defaultType;
  return newIdentifier;
};

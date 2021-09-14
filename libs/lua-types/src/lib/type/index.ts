import { LuaTypeAny } from './type-any';
import { LuaTypeNumber } from './type-number';
import { LuaTypeString } from './type-string';
import { LuaTypeBoolean } from './type-boolean';
import { LuaTypeLiteral } from './type-literal';
import { LuaTypeVoid } from './type-void';
import { LuaTypeReference } from './type-reference';
import { LuaTypeUnion } from './type-union';

export * from './type-any';
export * from './type-boolean';
export * from './type-literal';
export * from './type-number';
export * from './type-property-signature';
export * from './type-reference';
export * from './type-string';
export * from './type-union';
export * from './type-void';

export type LuaType =
  | LuaTypeAny
  | LuaTypeString
  | LuaTypeNumber
  | LuaTypeBoolean
  | LuaTypeLiteral
  | LuaTypeVoid
  | LuaTypeReference
  | LuaTypeUnion;

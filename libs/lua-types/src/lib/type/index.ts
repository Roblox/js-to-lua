import { LuaTypeAny } from './type-any';
import { LuaTypeNumber } from './type-number';
import { LuaTypeString } from './type-string';
import { LuaTypeBoolean } from './type-boolean';
import { LuaTypeLiteral } from './type-literal';
import { LuaTypeVoid } from './type-void';

export * from './type-any';
export * from './type-boolean';
export * from './type-literal';
export * from './type-number';
export * from './type-property-signature';
export * from './type-string';
export * from './type-void';

export type LuaType =
  | LuaTypeAny
  | LuaTypeString
  | LuaTypeNumber
  | LuaTypeBoolean
  | LuaTypeLiteral
  | LuaTypeVoid;

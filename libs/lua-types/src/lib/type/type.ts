import { LuaTypeAny } from './type-any';
import { LuaTypeNumber } from './type-number';
import { LuaTypeString } from './type-string';
import { LuaTypeBoolean } from './type-boolean';
import { LuaTypeLiteral } from './type-literal';
import { LuaTypeVoid } from './type-void';
import { LuaTypeReference } from './type-reference';
import { LuaTypeUnion } from './type-union';
import { LuaTypeNil } from './type-nil';
import { LuaTypeOptional } from './type-optional';
import { LuaTypeIntersection } from './type-intersection';
import { LuaLiteralType } from './literal-type';
import { LuaTypeFunction } from './type-function';

export type LuaType =
  | LuaTypeAny
  | LuaTypeString
  | LuaTypeNumber
  | LuaTypeBoolean
  | LuaTypeLiteral
  | LuaTypeNil
  | LuaTypeOptional
  | LuaTypeVoid
  | LuaTypeReference
  | LuaTypeUnion
  | LuaTypeIntersection
  | LuaTypeFunction
  | LuaLiteralType;

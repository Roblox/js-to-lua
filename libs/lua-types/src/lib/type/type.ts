import { LuaLiteralType } from './literal-type';
import { LuaTypeAny } from './type-any';
import { LuaTypeBoolean } from './type-boolean';
import { LuaTypeFunction } from './type-function';
import { LuaTypeIntersection } from './type-intersection';
import { LuaTypeLiteral } from './type-literal';
import { LuaTypeNil } from './type-nil';
import { LuaTypeNumber } from './type-number';
import { LuaTypeOptional } from './type-optional';
import { LuaTypeParameterDeclaration } from './type-parameter-declaration';
import { LuaTypeQuery } from './type-query';
import { LuaTypeReference } from './type-reference';
import { LuaTypeString } from './type-string';
import { LuaTypeUnion } from './type-union';
import { LuaTypeVoid } from './type-void';

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
  | LuaLiteralType
  | LuaTypeQuery
  | LuaTypeParameterDeclaration;

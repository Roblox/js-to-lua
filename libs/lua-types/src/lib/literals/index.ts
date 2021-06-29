import { isNumericLiteral, LuaNumericLiteral } from './numeric';
import { isStringLiteral, LuaStringLiteral } from './string';
import {
  isMultilineStringLiteral,
  LuaMultilineStringLiteral,
} from './multiline-string';
import { isBooleanLiteral, LuaBooleanLiteral } from './boolean';
import { isNilLiteral, LuaNilLiteral } from './nil';
import { isAnyNodeType } from '../node.types';

export * from './numeric';
export * from './string';
export * from './multiline-string';
export * from './boolean';
export * from './nil';

export type LuaLiteral =
  | LuaNumericLiteral
  | LuaStringLiteral
  | LuaMultilineStringLiteral
  | LuaBooleanLiteral
  | LuaNilLiteral;

export const isLiteral = isAnyNodeType<LuaLiteral>([
  isNumericLiteral,
  isStringLiteral,
  isMultilineStringLiteral,
  isBooleanLiteral,
  isNilLiteral,
]);

import { TSNamedTupleMember, TSTupleType, TSType } from '@babel/types';
import {
  identifier,
  LuaType,
  LuaTypeLiteral,
  LuaTypeReference,
  typeLiteral,
  typeReference,
  typeUnion,
} from '@js-to-lua/lua-types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { uniqWith } from 'ramda';

const replacer = (key: string, value: unknown): unknown =>
  Array<keyof TSNamedTupleMember | TSType>(
    'leadingComments',
    'innerComments',
    'trailingComments',
    'start',
    'end',
    'loc',
    'range'
  ).includes(key as any)
    ? undefined
    : value;

const equalNodes = (
  a: TSNamedTupleMember | TSType,
  b: TSNamedTupleMember | TSType
): boolean => {
  if (a.type !== b.type) {
    return false;
  }
  return JSON.stringify(a, replacer) === JSON.stringify(b, replacer);
};

export const createTsTupleTypeHandler = (
  typesHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaTypeLiteral | LuaTypeReference, TSTupleType>(
    'TSTupleType',
    (source, config, node) => {
      const handleType = typesHandlerFunction(source, config);
      const types = uniqWith(equalNodes, node.elementTypes).map(handleType);

      return types.length === 0
        ? typeLiteral([])
        : typeReference(identifier('Array'), [
            types.length === 1 ? types[0] : typeUnion(types),
          ]);
    }
  );

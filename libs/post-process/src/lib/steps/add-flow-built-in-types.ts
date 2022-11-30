import {
  getFlowBuiltInTypeExtra,
  prependProgram,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaType,
  typeAliasDeclaration,
  typeAny,
  typeParameterDeclaration,
  typeReference,
  typeString,
} from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';

export const addFlowBuiltInTypes: ProcessProgramFunction = (program) => {
  const builtIns = getFlowBuiltInTypeExtra(program);

  return builtIns.length
    ? prependProgram(
        builtIns.map(({ name, generics }) =>
          withTrailingConversionComment(
            typeAliasDeclaration(
              identifier(name),
              builtInPolyfill[name] || typeAny(),
              generics?.length
                ? typeParameterDeclaration(
                    generics.map((g) => typeReference(identifier(g)))
                  )
                : undefined
            ),
            `ROBLOX TODO: Flow '${name}' built-in type is not available in Luau`
          )
        ),

        program
      )
    : program;
};

const builtInPolyfill: {
  [P in string]?: LuaType;
} = {
  Keys: typeString(),
  Values: undefined,
  ReadOnly: typeReference(identifier('T')),
  Exact: typeReference(identifier('T')),
  Diff: typeReference(identifier('T')),
  Rest: typeReference(identifier('T')),
  PropertyType: undefined,
  ElementType: undefined,
  NonMaybeType: undefined,
  ObjMap: undefined,
  ObjMapi: undefined,
  ObjMapConst: undefined,
  KeyMirror: undefined,
  TupleMap: undefined,
  Call: undefined,
  Class: typeReference(identifier('T')),
  Shape: undefined,
  Exports: undefined,
  Supertype: undefined,
  Subtype: undefined,
};

import {
  getTsBuiltInTypeExtra,
  prependProgram,
  TsBuiltInTypeId,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaType,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeIndexSignature,
  typeLiteral,
  typeParameterDeclaration,
  typeReference,
  typeString,
} from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';

export const addTsBuiltInTypes: ProcessProgramFunction = (program) => {
  const builtIns = getTsBuiltInTypeExtra(program);

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
            `ROBLOX TODO: TS '${name}' built-in type is not available in Luau`
          )
        ),

        program
      )
    : program;
};

const builtInPolyfill: {
  [P in TsBuiltInTypeId]?: LuaType;
} = {
  Awaited: undefined,
  Partial: typeReference(identifier('T')),
  Required: typeReference(identifier('T')),
  Readonly: typeReference(identifier('T')),
  Record: typeLiteral([
    typeIndexSignature(
      typeReference(identifier('K')),
      typeAnnotation(typeReference(identifier('T')))
    ),
  ]),
  Pick: typeReference(identifier('T')),
  Omit: typeReference(identifier('T')),
  Exclude: undefined,
  Extract: undefined,
  NonNullable: typeReference(identifier('T')),
  Parameters: undefined,
  ConstructorParameters: undefined,
  ReturnType: undefined,
  InstanceType: undefined,
  ThisParameterType: undefined,
  OmitThisParameter: undefined,
  ThisType: undefined,
  Uppercase: typeString(),
  Lowercase: typeString(),
  Capitalize: typeString(),
  Uncapitalize: typeString(),
};

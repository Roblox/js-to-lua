import {
  packagesIdentifier,
  polyfillIdentifier,
  prependProgram,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  typeAliasDeclaration,
  typeParameterDeclaration,
  typeReference,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';

export const addPolyfills: ProcessProgramFunction = (program) => {
  const extras = program.extras || {};
  const polyfills = Object.keys(extras)
    .filter((key) => key.startsWith('polyfill.'))
    .map((key) => key.split('.')[1])
    .sort();

  const polyfillTypes = Object.keys(extras)
    .filter((key) => key.startsWith('polyfillType.'))
    .map((key) => key.split('.')[1])
    .sort()
    .map((key) => extras[`polyfillType.${key}`]) as {
    name: string;
    generics?: string[];
  }[];

  return polyfills.length || polyfillTypes.length
    ? prependProgram(
        [
          variableDeclaration(
            [variableDeclaratorIdentifier(polyfillIdentifier)],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(packagesIdentifier, '.', polyfillIdentifier),
                ])
              ),
            ]
          ),
          ...polyfills.map((key) =>
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier(key))],
              [
                variableDeclaratorValue(
                  memberExpression(polyfillIdentifier, '.', identifier(key))
                ),
              ]
            )
          ),
          ...polyfillTypes.map((type) =>
            typeAliasDeclaration(
              identifier(`${type.name}`),
              typeReference(
                identifier(
                  `${polyfillIdentifier.name}.${type.name}${
                    type.generics ? `<${type.generics.join(',')}>` : ''
                  }`
                )
              ),
              type.generics
                ? typeParameterDeclaration(
                    type.generics.map((t) => typeReference(identifier(t)))
                  )
                : undefined
            )
          ),
        ],
        program
      )
    : program;
};

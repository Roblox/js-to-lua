import { Program } from '@babel/types';
import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import {
  hasUnknownTypePolyfillExtra,
  visit,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  BaseLuaNode,
  callExpression,
  identifier,
  LuaProgram,
  LuaStatement,
  memberExpression,
  returnStatement,
  tableConstructor,
  typeAliasDeclaration,
  typeAny,
  typeParameterDeclaration,
  typeReference,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { pipe } from 'ramda';
import { handleStatement } from '../expression-statement.handler';

const polyfillIdentifier = identifier('LuauPolyfill');
const packagesIdentifier = identifier('Packages');
const exportsIdentifier = identifier('exports');

export const handleProgram: BaseNodeHandler<LuaProgram, Program> =
  createHandler('Program', (source, config, program) => {
    const body = Array.isArray(program.body) ? program.body : [program.body];

    return postProcess({
      type: 'Program',
      body: body.map(handleStatement.handler(source, config)),
    });
  });

const postProcess = (program: LuaProgram): LuaProgram => {
  return pipe(
    gatherExtras,
    addExports,
    addPolyfills,
    addImports,
    addUnknownPolyfillType,
    removeExtras
  )(program);
};

function gatherExtras(program: LuaProgram): LuaProgram {
  const extras = Array<BaseLuaNode['extras']>();
  visit(program, (node) => {
    if (node.extras) {
      extras.push(node.extras);
    }
  });

  return {
    ...program,
    ...(extras.length
      ? {
          extras: extras.reduce(
            (gathered, e) => ({
              ...gathered,
              ...e,
            }),
            {}
          ),
        }
      : {}),
  };
}

function removeExtras(program: LuaProgram): LuaProgram {
  visit(program, (node) => {
    if (node.extras) {
      delete node.extras;
    }
  });
  return program;
}

function addImports(program: LuaProgram): LuaProgram {
  return program.extras?.needsPackages
    ? prependProgram(
        [
          withTrailingConversionComment(
            variableDeclaration(
              [variableDeclaratorIdentifier(packagesIdentifier)],
              []
            ),
            'ROBLOX comment: must define Packages module'
          ),
        ],
        program
      )
    : program;
}

function addExports(program: LuaProgram): LuaProgram {
  return program.extras?.doesExport
    ? {
        ...program,
        body: [
          variableDeclaration(
            [variableDeclaratorIdentifier(exportsIdentifier)],
            [variableDeclaratorValue(tableConstructor())]
          ),
          ...program.body,
          returnStatement(exportsIdentifier),
        ],
      }
    : program;
}

function addPolyfills(program: LuaProgram) {
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
    ? {
        ...program,
        body: [
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
          ...program.body,
        ],
      }
    : program;
}

function addUnknownPolyfillType(program: LuaProgram) {
  return hasUnknownTypePolyfillExtra(program)
    ? prependProgram(
        [
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('unknown'), typeAny()),
            'ROBLOX FIXME: adding `unknown` type alias to make it easier to use Luau unknown equivalent when supported'
          ),
        ],
        program
      )
    : program;
}

function prependProgram(statements: LuaStatement[], program: LuaProgram) {
  return {
    ...program,
    body: [...statements, ...program.body],
  };
}

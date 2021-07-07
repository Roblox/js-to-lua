import { BaseNodeHandler, createHandler } from '../../types';
import { Program } from '@babel/types';
import { handleStatement } from '../expression-statement.handler';
import {
  identifier,
  isMemberExpression,
  isNodeGroup,
  isVariableDeclaration,
  LuaProgram,
  returnStatement,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { equals, pipe } from 'ramda';
import { isTruthy } from '@js-to-lua/shared-utils';

export const handleProgram: BaseNodeHandler<
  LuaProgram,
  Program
> = createHandler('Program', (source, config, program) => {
  const body = Array.isArray(program.body) ? program.body : [program.body];

  return postProcess({
    type: 'Program',
    body: body.map(handleStatement.handler(source, config)),
  });
});

const postProcess = (program: LuaProgram): LuaProgram => {
  return pipe(addImports, addExports)(program);
};

function addImports(program: LuaProgram): LuaProgram {
  const needsPackageImport = program.body
    .map((statement) =>
      isNodeGroup(statement) ? [statement, ...statement.body] : [statement]
    )
    .flat()
    .map((statement) =>
      isVariableDeclaration(statement)
        ? [
            statement,
            ...statement.values.map((v) => v.value),
            ...statement.identifiers.map((v) => v.value),
          ]
        : [statement]
    )
    .flat()
    .filter(isTruthy)
    .map((statement) =>
      isMemberExpression(statement)
        ? [statement, statement.base, statement.identifier]
        : [statement]
    )
    .flat()
    .map((statement) => statement.extras?.needsPackages)
    .some(equals<unknown>(true));

  return needsPackageImport
    ? {
        ...program,
        body: [
          withConversionComment(
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Packages'))],
              []
            ),
            'ROBLOX comment: must define Packages module'
          ),
          ...program.body,
        ],
      }
    : program;
}

function addExports(program: LuaProgram): LuaProgram {
  const needsExports = program.body
    .map((statement) => statement.extras?.doesExport)
    .some(equals<unknown>(true));

  return needsExports
    ? {
        ...program,
        body: [
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          ...program.body,
          returnStatement(identifier('exports')),
        ],
      }
    : program;
}

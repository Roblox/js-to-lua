import { BaseNodeHandler, createHandler } from '../../types';
import { Program } from '@babel/types';
import { handleStatement } from '../expression-statement.handler';
import {
  identifier,
  LuaProgram,
  returnStatement,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { equals, pipe } from 'ramda';

export const handleProgram: BaseNodeHandler<
  LuaProgram,
  Program
> = createHandler('Program', (source, program) => {
  const body = Array.isArray(program.body) ? program.body : [program.body];

  return postProcess({
    type: 'Program',
    body: body.map(handleStatement.handler(source)),
  });
});

const postProcess = (program: LuaProgram): LuaProgram => {
  return pipe(addExports)(program);
};

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

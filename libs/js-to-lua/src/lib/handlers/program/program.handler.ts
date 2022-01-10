import { BaseNodeHandler, createHandler } from '../../types';
import { Program } from '@babel/types';
import { handleStatement } from '../expression-statement.handler';
import {
  BaseLuaNode,
  identifier,
  LuaProgram,
  returnStatement,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { pipe } from 'ramda';
import { visit } from '../../utils/visitor';

export const handleProgram: BaseNodeHandler<LuaProgram, Program> =
  createHandler('Program', (source, config, program) => {
    const body = Array.isArray(program.body) ? program.body : [program.body];

    return postProcess({
      type: 'Program',
      body: body.map(handleStatement.handler(source, config)),
    });
  });

const postProcess = (program: LuaProgram): LuaProgram => {
  return pipe(gatherExtras, addExports, addImports, removeExtras)(program);
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
    ? {
        ...program,
        body: [
          withTrailingConversionComment(
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
  return program.extras?.doesExport
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

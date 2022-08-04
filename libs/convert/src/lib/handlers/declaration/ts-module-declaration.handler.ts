import * as Babel from '@babel/types';
import { Statement } from '@babel/types';
import {
  combineHandlers,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  defaultStatementHandler,
  isWithExportsExtras,
} from '@js-to-lua/lua-conversion-utils';
import {
  blockStatement,
  identifier,
  isBlockStatement,
  isNodeGroup,
  LuaNode,
  LuaStatement,
  nodeGroup,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { applyTo, pipe } from 'ramda';
import { createTSModuleBlockHandler } from './ts-module-block.handler';
import { getNamespaceStatements } from './ts-module-declaration.helpers';

export const createTsModuleDeclarationHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>
) => {
  const tSModuleBlockHandler = createTSModuleBlockHandler(handleStatement);
  const handleTsModuleDeclarationBody = combineHandlers<
    LuaStatement,
    Babel.TSModuleDeclaration['body']
  >([tSModuleBlockHandler], handleStatement).handler;

  return createHandler<LuaStatement, Babel.TSModuleDeclaration>(
    'TSModuleDeclaration',
    (source, config, node) => {
      if (node.global || node.declare) {
        return defaultStatementHandler(source, config, node);
      }

      const body = handleTsModuleDeclarationBody(source, config, node.body);
      const bodyStatements = isNodeGroup(body) ? body.body : [body];

      const exportedStatements = bodyStatements.filter(isWithExportsExtras);
      const notExportedStatements = bodyStatements.filter(
        isWithExportsExtras.not
      );
      const namespaceName = Babel.isIdentifier(node.id)
        ? node.id.name
        : node.id.value;
      const namespaceDeclaration = variableDeclaration(
        [variableDeclaratorIdentifier(identifier(namespaceName))],
        [variableDeclaratorValue(tableConstructor())]
      );
      const notEmptyBlock = (node: LuaNode) =>
        !isBlockStatement(node) || node.body.length > 0;

      return exportedStatements.length
        ? applyTo(
            exportedStatements,
            pipe(
              getNamespaceStatements(namespaceName),
              ({ innerStatements, outerStatements }) =>
                nodeGroup(
                  [
                    namespaceDeclaration,
                    ...outerStatements,
                    blockStatement([
                      ...innerStatements,
                      ...notExportedStatements,
                    ]),
                  ].filter(notEmptyBlock)
                )
            )
          )
        : nodeGroup(
            [namespaceDeclaration, blockStatement(bodyStatements)].filter(
              notEmptyBlock
            )
          );
    }
  );
};

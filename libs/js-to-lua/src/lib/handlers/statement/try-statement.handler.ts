import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import {
  blockStatement,
  booleanLiteral,
  callExpression,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  isReturnStatement,
  LuaCallExpression,
  LuaIdentifier,
  LuaStatement,
  LuaType,
  returnStatement,
  unaryNegationExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withInnerConversionComment,
} from '@js-to-lua/lua-types';
import {
  Identifier,
  Statement,
  TryStatement,
  FunctionDeclaration,
  TSType,
} from '@babel/types';
import { pipe } from 'ramda';
import { isTruthy } from '@js-to-lua/shared-utils';
import { createFunctionParamsHandler } from '../function-params.handler';

export const createTryStatementHandler = (
  statementHandlerFunction: HandlerFunction<LuaStatement, Statement>,
  identifierHandlerFunction: HandlerFunction<LuaIdentifier, Identifier>,
  typesHandlerFunction: HandlerFunction<LuaType, TSType>
): BaseNodeHandler<LuaStatement, TryStatement> =>
  createHandler('TryStatement', (source, config, node) => {
    const handleStatement = statementHandlerFunction(source, config);
    const handleTryCatchStatement = pipe(
      handleStatement,
      (result: LuaStatement) =>
        isReturnStatement(result)
          ? {
              ...result,
              arguments: [...result.arguments, booleanLiteral(true)],
            }
          : result
    );
    const functionParamsHandler = createFunctionParamsHandler(
      identifierHandlerFunction,
      typesHandlerFunction
    );

    const executeTryCatchDeclaration = (expression: LuaCallExpression) =>
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('ok')),
          variableDeclaratorIdentifier(identifier('result')),
          variableDeclaratorIdentifier(identifier('hasReturned')),
        ],
        [variableDeclaratorValue(expression)]
      );

    const finalizerStatements = node.finalizer
      ? [blockStatement(node.finalizer.body.map(handleStatement))]
      : [];

    return withInnerConversionComment(
      blockStatement([
        ...(node.handler
          ? [
              executeTryCatchDeclaration(
                callExpression(identifier('xpcall'), [
                  functionExpression(
                    [],
                    node.block.body.map(handleTryCatchStatement)
                  ),
                  functionExpression(
                    node.handler.param
                      ? functionParamsHandler(source, config, {
                          params: [node.handler.param],
                        } as FunctionDeclaration)
                      : [],
                    (node.handler.body.body || []).map(handleTryCatchStatement)
                  ),
                ])
              ),
              ...finalizerStatements,
              ifStatement(
                ifClause(identifier('hasReturned'), [
                  returnStatement(identifier('result')),
                ])
              ),
            ]
          : [
              executeTryCatchDeclaration(
                callExpression(identifier('pcall'), [
                  functionExpression([], node.block.body.map(handleStatement)), // body
                ])
              ),
              ...finalizerStatements,
              ifStatement(
                ifClause(identifier('hasReturned'), [
                  returnStatement(identifier('result')),
                ])
              ),
              ifStatement(
                ifClause(unaryNegationExpression(identifier('ok')), [
                  callExpression(identifier('error'), [identifier('result')]),
                ])
              ),
            ]),
      ]),
      `ROBLOX COMMENT: ${[
        'try',
        node.handler && 'catch',
        node.finalizer && 'finally',
      ]
        .filter(isTruthy)
        .join('-')} block conversion`
    );
  });

import * as Babel from '@babel/types';
import {
  FlowType,
  Identifier,
  Statement,
  TryStatement,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { withInnerConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  blockStatement,
  booleanLiteral,
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  isNodeGroup,
  isReturnStatement,
  LuaCallExpression,
  LuaDeclaration,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  nodeGroup,
  returnStatement,
  unaryNegationExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { applyTo, dropLast, last, pipe } from 'ramda';
import { createFunctionParamsWithBodyHandler } from '../function-params-with-body.handler';

export const createTryStatementHandler = (
  statementHandlerFunction: HandlerFunction<LuaStatement, Statement>,
  identifierHandlerFunction: HandlerFunction<LuaIdentifier, Identifier>,
  declarationHandlerFunction: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Babel.Declaration
  >,
  assignmentPatternHandlerFunction: HandlerFunction<
    AssignmentStatement,
    Babel.AssignmentPattern
  >,
  lValHandlerFunction: HandlerFunction<LuaLVal, Babel.LVal>,
  typesAnnotationHandlerFunction: HandlerFunction<
    LuaType,
    TypeAnnotation | TSTypeAnnotation
  >,
  typesHandlerFunction: HandlerFunction<LuaType, FlowType | TSType>
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
          : isNodeGroup(result)
          ? applyTo(result, (group) => {
              const lastNode = last(group.body);
              return lastNode && isReturnStatement(lastNode)
                ? {
                    ...group,
                    body: [
                      ...dropLast(1, group.body),
                      {
                        ...lastNode,
                        arguments: [
                          ...lastNode.arguments,
                          booleanLiteral(true),
                        ],
                      },
                    ],
                  }
                : group;
            })
          : result
    );
    const handleParamsWithBody = createFunctionParamsWithBodyHandler(
      identifierHandlerFunction,
      declarationHandlerFunction,
      assignmentPatternHandlerFunction,
      lValHandlerFunction,
      typesAnnotationHandlerFunction,
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
          ? applyTo(
              node.handler,
              pipe(
                (catchClause: Babel.CatchClause) => ({
                  paramsResponse: handleParamsWithBody(source, config, {
                    params: catchClause.param ? [catchClause.param] : [],
                  }),
                  catchBody: (catchClause.body.body || []).map(
                    handleTryCatchStatement
                  ),
                }),
                ({
                  paramsResponse: { params: functionParams, body: paramsBody },
                  catchBody,
                }) => [
                  executeTryCatchDeclaration(
                    callExpression(identifier('xpcall'), [
                      functionExpression(
                        [],
                        nodeGroup(node.block.body.map(handleTryCatchStatement))
                      ),
                      functionExpression(
                        functionParams,
                        nodeGroup([...paramsBody, ...catchBody])
                      ),
                    ])
                  ),
                  ...finalizerStatements,
                  ifStatement(
                    ifClause(
                      identifier('hasReturned'),
                      nodeGroup([returnStatement(identifier('result'))])
                    )
                  ),
                ]
              )
            )
          : [
              executeTryCatchDeclaration(
                callExpression(identifier('pcall'), [
                  functionExpression(
                    [],
                    nodeGroup(node.block.body.map(handleStatement))
                  ),
                ])
              ),
              ...finalizerStatements,
              ifStatement(
                ifClause(
                  identifier('hasReturned'),
                  nodeGroup([returnStatement(identifier('result'))])
                )
              ),
              ifStatement(
                ifClause(
                  unaryNegationExpression(identifier('ok')),
                  nodeGroup([
                    expressionStatement(
                      callExpression(identifier('error'), [
                        identifier('result'),
                      ])
                    ),
                  ])
                )
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

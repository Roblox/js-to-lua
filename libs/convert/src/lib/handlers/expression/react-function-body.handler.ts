import {
  ArrowFunctionExpression,
  BlockStatement,
  ClassMethod,
  ClassPrivateMethod,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  isBlockStatement,
  isCallExpression,
  isExpressionStatement,
  isSuper,
  isTSDeclareMethod,
  Statement,
  TSDeclareMethod
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  EmptyConfig,
  HandlerFunction
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturnStatement,
  hasAnyComment,
  promiseMethod
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  isNodeGroup,
  LuaStatement,
  memberExpression,
  nilLiteral,
  nodeGroup,
  returnStatement,
  stringLiteral
} from '@js-to-lua/lua-types';
import { applyTo, curry } from 'ramda';
import { createInnerBodyStatementHandler } from '../inner-statement-body-handler';

type FunctionTypes =
  | FunctionDeclaration
  | FunctionExpression
  | ArrowFunctionExpression
  | ClassMethod
  | ClassPrivateMethod
  | TSDeclareMethod;

export const createReactFunctionBodyHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) =>
  curry(
    (
      source: string,
      config: EmptyConfig,
      node: FunctionTypes
    ): LuaStatement[] => {
      return applyTo(functionBodyStatements(), (body: LuaStatement[]) =>
        !node.async
          ? body
          : body.length
            ? [
              returnStatement(
                callExpression(
                  memberExpression(
                    callExpression(promiseMethod('resolve'), []),
                    ':',
                    identifier('andThen')
                  ),
                  [
                    functionExpression(
                      [],
                      body.length === 1 && isNodeGroup(body[0])
                        ? body[0]
                        : nodeGroup(body)
                    ),
                  ]
                )
              ),
            ]
            : [
              returnStatement(
                callExpression(promiseMethod('resolve'), [nilLiteral()])
              ),
            ]
      );

      function functionBodyStatements(): LuaStatement[] {
        if (isTSDeclareMethod(node)) {
          return [
            expressionStatement(
              callExpression(identifier('error'), [
                stringLiteral(
                  `not implemented ${node.abstract ? 'abstract ' : ''}method`
                ),
              ])
            ),
          ];
        }

        const handleBody = createInnerBodyStatementHandler(handleStatement);
        const isSuperCall = (node: object | null | undefined) =>
          isExpressionStatement(node) && isCallExpression(node.expression) && isSuper(node.expression.callee)

        const handleBlockStatementBody = (
          source: string,
          config: EmptyConfig,
          _body: BlockStatement
        ) => {
          const body = {
            ..._body,
            body: _body.body.filter(node => !isSuperCall(node))
          }
          const handled = handleBody(source, config, body);
          return handled.body.length || hasAnyComment(handled) ? [handled] : [];
        };

        return isBlockStatement(node.body)
          ? handleBlockStatementBody(source, config, node.body)
          : asStatementReturnTypeToReturnStatement(
            handleExpressionAsStatement(source, config, node.body)
          );
      }
    }
  );

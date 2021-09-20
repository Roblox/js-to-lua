import { EmptyConfig, HandlerFunction } from '../../types';
import {
  expressionStatement,
  isExpression,
  isNodeGroup,
  LuaExpression,
  LuaStatement,
  returnStatement,
} from '@js-to-lua/lua-types';
import {
  ArrowFunctionExpression,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  Statement,
  ClassPrivateMethod,
  ClassMethod,
} from '@babel/types';
import { applyTo, curry } from 'ramda';
import { getReturnExpressions } from '../../utils/get-return-expressions';

export const createFunctionBodyHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >
) =>
  curry(
    (
      source: string,
      config: EmptyConfig,
      node:
        | FunctionDeclaration
        | FunctionExpression
        | ArrowFunctionExpression
        | ClassMethod
        | ClassPrivateMethod
    ): LuaStatement[] =>
      node.body.type === 'BlockStatement'
        ? node.body.body.map(handleStatement(source, config))
        : applyTo(
            handleExpressionAsStatement(source, config, node.body),
            (expression) => {
              const returnExpressions = getReturnExpressions(expression);
              return returnExpressions.every((e) => e === expression)
                ? [returnStatement(...returnExpressions)]
                : [
                    ...applyTo(
                      isNodeGroup(expression)
                        ? expression.body.filter(
                            (e) =>
                              !returnExpressions.includes(e as LuaExpression)
                          )
                        : [expression],
                      (expressions: Array<LuaExpression | LuaStatement>) =>
                        expressions.map((expression) =>
                          isExpression(expression)
                            ? expressionStatement(expression)
                            : expression
                        )
                    ),
                    returnStatement(...returnExpressions),
                  ];
            }
          )
  );

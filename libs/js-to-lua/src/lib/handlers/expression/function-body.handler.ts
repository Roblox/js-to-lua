import {
  ArrowFunctionExpression,
  BlockStatement,
  ClassMethod,
  ClassPrivateMethod,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  isTSDeclareMethod,
  Statement,
  TSDeclareMethod,
} from '@babel/types';
import {
  callExpression,
  expressionStatement,
  identifier,
  isExpression,
  isNodeGroup,
  LuaExpression,
  LuaStatement,
  returnStatement,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { applyTo, curry } from 'ramda';
import { EmptyConfig, HandlerFunction } from '../../types';
import { createExpressionStatement } from '../../utils/create-expression-statement';
import { getReturnExpressions } from '../../utils/get-return-expressions';
import { createInnerBodyStatementHandler } from '../inner-statement-body-handler';

type FunctionTypes =
  | FunctionDeclaration
  | FunctionExpression
  | ArrowFunctionExpression
  | ClassMethod
  | ClassPrivateMethod
  | TSDeclareMethod;

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
      node: FunctionTypes
    ): LuaStatement[] => {
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
      const handleBlockStatementBody = (
        source: string,
        config: EmptyConfig,
        body: BlockStatement
      ) => {
        const handled = handleBody(source, config, body);
        return handled.body.length || handled.innerComments?.length
          ? [handled]
          : [];
      };

      return node.body.type === 'BlockStatement'
        ? handleBlockStatementBody(source, config, node.body)
        : applyTo(
            {
              expression: handleExpressionAsStatement(
                source,
                config,
                node.body
              ),
              babelExpression: node.body,
            },
            ({ expression, babelExpression }) => {
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
                            ? createExpressionStatement(
                                source,
                                babelExpression,
                                expression
                              )
                            : expression
                        )
                    ),
                    returnStatement(...returnExpressions),
                  ];
            }
          );
    }
  );

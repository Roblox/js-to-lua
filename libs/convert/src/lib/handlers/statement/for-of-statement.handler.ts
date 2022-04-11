import {
  Expression,
  ForOfStatement as BabelForOfStatement,
  isVariableDeclaration as isBabelVariableDeclaration,
  LVal,
  ObjectMethod,
  ObjectProperty,
  Statement,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  isArrayInferable,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  ForGenericStatement,
  forGenericStatement,
  identifier,
  LuaExpression,
  LuaLVal,
  LuaStatement,
  LuaTableKeyField,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import { IdentifierStrictHandlerFunction } from '../expression/identifier-handler-types';
import { createInnerBodyStatementHandler } from '../inner-statement-body-handler';
import { createExtractForOfDeclaration } from './for-of-statement-extract-declaration';
import { createExtractForOfAssignmentStatement } from './for-of-statement-extract-statement';

export const createForOfStatementHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >
): BaseNodeHandler<ForGenericStatement, BabelForOfStatement> => {
  const bodyStatementHandler = createInnerBodyStatementHandler(handleStatement);
  return createHandler('ForOfStatement', (source, config, node) => {
    if (node.await) {
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ${node.type} with await modifier`,
        getNodeSource(source, node)
      );
    }
    const rightExpression: LuaExpression = handleExpression(
      source,
      config,
      node.right
    );
    if (!isBabelVariableDeclaration(node.left)) {
      const result = createExtractForOfAssignmentStatement(
        handleIdentifierStrict,
        handleExpression,
        handleStatement,
        handleLVal,
        handleObjectField
      )(source, config, node.left);

      return result
        ? forGenericStatement(
            [identifier('_'), result.identifier],
            [
              applyTo(callExpression(identifier('ipairs'), [rightExpression]))(
                (expression) =>
                  isArrayInferable(rightExpression)
                    ? expression
                    : withTrailingConversionComment(
                        expression,
                        `ROBLOX CHECK: check if '${getNodeSource(
                          source,
                          node.right
                        )}' is an Array`
                      )
              ),
            ],
            [result.statement, bodyStatementHandler(source, config, node.body)]
          )
        : withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled node for type: ${node.type} where left side is not handled`,
            getNodeSource(source, node)
          );
    }

    const { identifiers, statements } = createExtractForOfDeclaration(
      handleIdentifierStrict,
      handleExpression,
      handleStatement,
      handleLVal,
      handleObjectField
    )(source, config, node.left);

    return forGenericStatement(
      [identifier('_'), ...identifiers],
      [
        applyTo(callExpression(identifier('ipairs'), [rightExpression]))(
          (expression) =>
            isArrayInferable(rightExpression)
              ? expression
              : withTrailingConversionComment(
                  expression,
                  `ROBLOX CHECK: check if '${getNodeSource(
                    source,
                    node.right
                  )}' is an Array`
                )
        ),
      ],
      [...statements, bodyStatementHandler(source, config, node.body)]
    );
  });
};

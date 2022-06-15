import * as Babel from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  ForGenericStatement,
  forGenericStatement,
  LuaExpression,
  LuaLVal,
  LuaStatement,
  LuaTableKeyField,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { isSingleElementArray } from '@js-to-lua/shared-utils';
import { IdentifierStrictHandlerFunction } from '../expression/identifier-handler-types';
import { createInnerBodyStatementHandler } from '../inner-statement-body-handler';
import { createExtractForOfAssignmentStatement } from './for-of-statement-extract-statement';
import { createExtractForStatementDeclaration } from './for-statement-extract-declaration';

export const createForInStatementHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleLVal: HandlerFunction<LuaLVal, Babel.LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    Babel.ObjectMethod | Babel.ObjectProperty
  >
): BaseNodeHandler<ForGenericStatement, Babel.ForInStatement> => {
  const bodyStatementHandler = createInnerBodyStatementHandler(handleStatement);
  return createHandler('ForInStatement', (source, config, node) => {
    const rightExpression: LuaExpression = handleExpression(
      source,
      config,
      node.right
    );

    if (!Babel.isVariableDeclaration(node.left)) {
      const result = createExtractForOfAssignmentStatement(
        handleIdentifierStrict,
        handleExpression,
        handleStatement,
        handleLVal,
        handleObjectField
      )(source, config, node.left);

      return result
        ? forGenericStatement(
            [result.identifier],
            [rightExpression],
            [result.statement, bodyStatementHandler(source, config, node.body)]
          )
        : withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled node for type: ${node.type} where left side is not handled`,
            getNodeSource(source, node)
          );
    }

    if (!isSingleElementArray(node.left.declarations)) {
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ${node.type} where left side declaration doesn't have exactly one declarator`,
        getNodeSource(source, node)
      );
    }

    const { id, statements } = createExtractForStatementDeclaration(
      handleIdentifierStrict,
      handleExpression,
      handleStatement,
      handleLVal,
      handleObjectField
    )(source, config, {
      ...node,
      left: { ...node.left, declarations: node.left.declarations },
    });

    return forGenericStatement(
      [id],
      [rightExpression],
      [...statements, bodyStatementHandler(source, config, node.body)]
    );
  });
};

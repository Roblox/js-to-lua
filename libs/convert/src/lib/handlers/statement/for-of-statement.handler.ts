import {
  Expression,
  ForOfStatement as BabelForOfStatement,
  Identifier as BabelIdentifier,
  isIdentifier as isBabelIdentifier,
  isVariableDeclaration as isBabelVariableDeclaration,
  LVal,
  Statement,
  VariableDeclaration as BabelVariableDeclaration,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  defaultUnhandledIdentifierHandlerWithComment,
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
  LuaIdentifier,
  LuaStatement,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import { createInnerBodyStatementHandler } from '../inner-statement-body-handler';

export const createForOfStatementHandler = (
  handleIdentifier: HandlerFunction<LuaIdentifier, BabelIdentifier>,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>
): BaseNodeHandler<ForGenericStatement, BabelForOfStatement> => {
  const variableDeclarationsToIdentifiers = (
    source: string,
    config: EmptyConfig,
    { declarations }: BabelVariableDeclaration
  ): LuaIdentifier[] => {
    const handleLVal = (lval: LVal): LuaIdentifier =>
      isBabelIdentifier(lval)
        ? handleIdentifier(source, config, lval)
        : defaultUnhandledIdentifierHandlerWithComment(
            `ROBLOX TODO: Unhandled node for type: ${lval.type} within ForOfStatement left expression`
          )(source, config, lval);
    return declarations.map(({ id }) => id).map(handleLVal);
  };

  const bodyStatementHandler = createInnerBodyStatementHandler(handleStatement);
  return createHandler('ForOfStatement', (source, config, node) => {
    if (node.await) {
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ${node.type} with await modifier`,
        getNodeSource(source, node)
      );
    }

    if (!isBabelVariableDeclaration(node.left)) {
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ${node.type} where left side is not a variable declaration`,
        getNodeSource(source, node)
      );
    }

    const rightExpression = handleExpression(source, config, node.right);
    return forGenericStatement(
      [
        identifier('_'),
        ...variableDeclarationsToIdentifiers(source, config, node.left),
      ],
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
      [bodyStatementHandler(source, config, node.body)]
    );
  });
};

import {
  CallExpression,
  Expression,
  isMemberExpression as isBabelMemberExpression,
  isPrivateName,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  asStatementReturnTypeInline,
  createAsStatementHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturn,
  defaultExpressionHandler,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  indexExpression,
  isIdentifier,
  LuaExpression,
  LuaStatement,
  memberExpression,
} from '@js-to-lua/lua-types';
import { createCallExpressionArgumentsAsStatementHandler } from './call-expression-arguments-as-statement.handler';
import { createCalleeExpressionHandlerFunction } from './callee-expression.handler';
import { createCallExpressionSpecialCasesHandler } from './special-cases/call-expression-special-cases.handler';

export const createCallExpressionAsStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) =>
  createAsStatementHandler<LuaStatement, CallExpression>(
    'CallExpression',
    (source, config, expression) => {
      const handled = createCallExpressionSpecialCasesHandler(handleExpression)(
        source,
        config,
        expression
      );

      if (handled) {
        return asStatementReturnTypeInline([], handled, []);
      }

      const callee = expression.callee;
      const args = createCallExpressionArgumentsAsStatementHandler(
        handleExpression,
        handleExpressionAsStatement
      )(source, config, expression.arguments).map(
        asStatementReturnTypeToReturn
      );

      if (isBabelMemberExpression(callee)) {
        const propertyExpression = isPrivateName(callee.property)
          ? defaultExpressionHandler(source, config, callee.property)
          : handleExpression(source, config, callee.property);

        const objectExpression = handleExpression(
          source,
          config,
          callee.object
        );
        const res = isIdentifier(propertyExpression)
          ? callExpression(
              memberExpression(objectExpression, ':', propertyExpression),
              args.map(({ toReturn }) => toReturn)
            )
          : callExpression(
              indexExpression(objectExpression, propertyExpression),
              [objectExpression, ...args.map(({ toReturn }) => toReturn)]
            );

        return asStatementReturnTypeInline(
          args.map((a) => a.preStatements).flat(),
          res,
          args.map((a) => a.postStatements).flat()
        );
      }

      const handleCalleeExpression =
        createCalleeExpressionHandlerFunction(handleExpression);

      return asStatementReturnTypeInline(
        args.map((a) => a.preStatements).flat(),
        callExpression(
          handleCalleeExpression(source, config, expression.callee),
          args.map(({ toReturn }) => toReturn)
        ),
        args.map((a) => a.postStatements).flat()
      );
    }
  );

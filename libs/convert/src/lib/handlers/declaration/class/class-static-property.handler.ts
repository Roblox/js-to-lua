import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultUnhandledIdentifierHandlerWithComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  indexExpression,
  isIdentifier,
  LuaExpression,
  LuaIdentifier,
  LuaStatement,
  memberExpression,
  nilLiteral,
} from '@js-to-lua/lua-types';

export const createClassStaticPropertyHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) =>
  createHandlerFunction<
    LuaStatement,
    Babel.ClassPrivateProperty | Babel.ClassProperty,
    EmptyConfig & { classIdentifier: LuaIdentifier }
  >(
    (source, config, property) => {
      const propertyKey = !Babel.isPrivateName(property.key)
        ? handleExpression(source, config, property.key)
        : defaultUnhandledIdentifierHandlerWithComment(
            `ROBLOX comment: unhandled class body node type ${property.key.type}`
          )(source, config, property.key);
      return assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          isIdentifier(propertyKey)
            ? memberExpression(config.classIdentifier, '.', propertyKey)
            : indexExpression(config.classIdentifier, propertyKey),
        ],
        [
          property.value
            ? handleExpression(source, config, property.value)
            : nilLiteral(),
        ]
      );
    },
    { skipComments: true }
  );

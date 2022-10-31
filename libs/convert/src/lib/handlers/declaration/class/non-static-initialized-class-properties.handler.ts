import * as Babel from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  defaultUnhandledIdentifierHandlerWithComment,
  selfIdentifier,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  indexExpression,
  isIdentifier,
  LuaExpression,
  LuaIdentifier,
  memberExpression,
  nilLiteral,
} from '@js-to-lua/lua-types';
import { isAnyClassProperty } from './class-declaration.utils';

export const createNonStaticInitializedClassPropertiesGetter = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  return (
    source: string,
    config: EmptyConfig & { classIdentifier: LuaIdentifier },
    node: Babel.ClassDeclaration
  ) => {
    const nonStaticInitializedClassProperties = node.body.body
      .filter(isAnyClassProperty)
      .filter((n) => n.value && !n.static);

    return nonStaticInitializedClassProperties.map((n) => {
      const propertyKey = !Babel.isPrivateName(n.key)
        ? handleExpression(source, config, n.key)
        : defaultUnhandledIdentifierHandlerWithComment(
            `ROBLOX comment: unhandled class body node type ${n.key.type}`
          )(source, config, n.key);
      return assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          isIdentifier(propertyKey)
            ? memberExpression(selfIdentifier(), '.', propertyKey)
            : indexExpression(selfIdentifier(), propertyKey),
        ],
        [n.value ? handleExpression(source, config, n.value) : nilLiteral()]
      );
    });
  };
};

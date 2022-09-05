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
  LuaNodeGroup,
  memberExpression,
  nilLiteral,
  nodeGroup,
} from '@js-to-lua/lua-types';
import {
  createClassIdentifierPrivate,
  isAnyClassProperty,
  isPublic,
} from './class-declaration.utils';

export const createStaticPropsHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  return createHandlerFunction<
    LuaNodeGroup,
    Babel.ClassDeclaration,
    EmptyConfig & { classIdentifier: LuaIdentifier }
  >(
    (source, config, node) => {
      const staticInitializedClassProperties = node.body.body
        .filter(isAnyClassProperty)
        .filter((n) => n.value && n.static);

      const staticInitializedClassPropertiesPublic =
        staticInitializedClassProperties.filter(isPublic);

      const staticInitializedClassPropertiesNotPublic =
        staticInitializedClassProperties.filter((node) => !isPublic(node));

      return nodeGroup([
        ...staticInitializedClassPropertiesPublic.map(
          handleProperty(config.classIdentifier)
        ),
        ...staticInitializedClassPropertiesNotPublic.map(
          handleProperty(createClassIdentifierPrivate(config.classIdentifier))
        ),
      ]);

      function handleProperty(classIdentifier: LuaIdentifier) {
        return (property: Babel.ClassProperty | Babel.ClassPrivateProperty) => {
          const propertyKey = !Babel.isPrivateName(property.key)
            ? handleExpression(source, config, property.key)
            : defaultUnhandledIdentifierHandlerWithComment(
                `ROBLOX comment: unhandled class body node type ${property.key.type}`
              )(source, config, property.key);
          return assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              isIdentifier(propertyKey)
                ? memberExpression(classIdentifier, '.', propertyKey)
                : indexExpression(classIdentifier, propertyKey),
            ],
            [
              property.value
                ? handleExpression(source, config, property.value)
                : nilLiteral(),
            ]
          );
        };
      }
    },
    { skipComments: true }
  );
};

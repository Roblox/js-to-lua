import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaExpression,
  LuaIdentifier,
  LuaNodeGroup,
  nodeGroup,
} from '@js-to-lua/lua-types';
import {
  createClassIdentifierPrivate,
  isAnyClassProperty,
  isPublic,
} from '../class-declaration.utils';
import { createClassStaticPropertyHandler } from '../class-static-property.handler';

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

      const staticPropertyHandler =
        createClassStaticPropertyHandler(handleExpression);
      const handlePublicStaticProperty = staticPropertyHandler(source, config);
      const handlePrivateStaticProperty = staticPropertyHandler(source, {
        ...config,
        classIdentifier: createClassIdentifierPrivate(config.classIdentifier),
      });

      return nodeGroup([
        ...staticInitializedClassPropertiesPublic.map(
          handlePublicStaticProperty
        ),
        ...staticInitializedClassPropertiesNotPublic.map(
          handlePrivateStaticProperty
        ),
      ]);
    },
    { skipComments: true }
  );
};

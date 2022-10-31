import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaIdentifier,
  LuaNodeGroup,
  LuaStatement,
  nodeGroup,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import {
  isAnyClassMethod,
  isAnyClassProperty,
  isClassConstructor,
} from '../class-declaration.utils';

export const createClassMethodsHandlerFunction = (
  classMethodHandler: HandlerFunction<
    LuaStatement,
    Babel.ClassMethod | Babel.ClassPrivateMethod | Babel.TSDeclareMethod,
    EmptyConfig & { classBaseIdentifier: LuaIdentifier }
  >
) => {
  return createHandlerFunction<
    LuaNodeGroup,
    Babel.ClassDeclaration,
    EmptyConfig & { classBaseIdentifier: LuaIdentifier }
  >(
    (source, config, node) => {
      const handleClassMethod = classMethodHandler(source, config);

      const bodyWithoutConstructor = node.body.body.filter(
        (n) => !isClassConstructor(n)
      );

      const classMethods = bodyWithoutConstructor
        .filter((n) => !isAnyClassProperty(n))
        .map((n) => {
          if (isAnyClassMethod(n)) {
            return handleClassMethod(n);
          } else {
            return withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX comment: unhandled class body node type ${n.type}`,
              getNodeSource(source, n)
            );
          }
        });

      return nodeGroup(classMethods);
    },
    { skipComments: true }
  );
};

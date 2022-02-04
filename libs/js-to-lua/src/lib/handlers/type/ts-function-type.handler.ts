import {
  Expression,
  isRestElement,
  TSFunctionType,
  TSType,
} from '@babel/types';
import {
  LuaExpression,
  LuaType,
  LuaTypeFunction,
  typeAny,
  typeFunction,
} from '@js-to-lua/lua-types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { createRestElementHandler } from '../rest-element.handler';

export const createTsFunctionTypeHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typesHandlerFunction: HandlerFunction<LuaType, TSType>
) => {
  const restHandler = createRestElementHandler(typesHandlerFunction);
  const handleTsTypeFunction: BaseNodeHandler<LuaTypeFunction, TSFunctionType> =
    createHandler('TSFunctionType', (source, config, node) =>
      typeFunction(
        node.parameters.map((param) => {
          if (isRestElement(param)) {
            return restHandler(source, config, param);
          }
          return expressionHandlerFunction(source, config, param);
        }),
        node.typeAnnotation
          ? typesHandlerFunction(
              source,
              config,
              node.typeAnnotation.typeAnnotation
            )
          : typeAny()
      )
    );

  return handleTsTypeFunction;
};

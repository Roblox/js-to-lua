import { ObjectExpression } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaTableConstructor,
  LuaTableKeyField,
  tableConstructor,
} from '@js-to-lua/lua-types';
import { NoSpreadObjectProperty } from './object-expression.types';

export const createObjectExpressionWithoutSpreadHandler = (
  objectFieldHandlerFunction: HandlerFunction<
    LuaTableKeyField,
    NoSpreadObjectProperty
  >
) => {
  return createHandlerFunction<LuaTableConstructor, ObjectExpression>(
    (source, config, expression) =>
      tableConstructor(
        expression.properties.map(objectFieldHandlerFunction(source, config))
      ),
    { skipComments: true }
  );
};

import {
  Expression,
  isSpreadElement as isBabelSpreadElement,
  ObjectExpression,
  SpreadElement,
} from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { objectAssign, objectNone } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  isNilLiteral,
  isTableNoKeyField,
  LuaCallExpression,
  LuaExpression,
  LuaTableKeyField,
  tableConstructor,
} from '@js-to-lua/lua-types';
import { splitBy } from '@js-to-lua/shared-utils';
import {
  NoSpreadObjectProperty,
  ObjectExpressionProperty,
} from './object-expression.types';

export const createObjectExpressionWithSpreadHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  objectFieldHandlerFunction: HandlerFunction<
    LuaTableKeyField,
    NoSpreadObjectProperty
  >
) => {
  return createHandlerFunction<LuaCallExpression, ObjectExpression>(
    (source, config, expression: ObjectExpression) => {
      const propertiesGroups = expression.properties.reduce(
        splitBy<ObjectExpressionProperty, SpreadElement>(isBabelSpreadElement),
        []
      );
      const args: LuaExpression[] = propertiesGroups.map((group) => {
        const toField = objectFieldHandlerFunction(source, config);
        return Array.isArray(group)
          ? tableConstructor(
              group
                .map(toField)
                .map((field) =>
                  isTableNoKeyField(field) || !isNilLiteral(field.value)
                    ? field
                    : { ...field, value: objectNone() }
                )
            )
          : expressionHandlerFunction(source, config, group.argument);
      });

      return callExpression(objectAssign(), [tableConstructor([]), ...args]);
    },
    { skipComments: true }
  );
};

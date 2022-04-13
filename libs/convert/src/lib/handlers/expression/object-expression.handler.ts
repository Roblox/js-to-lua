import {
  Expression,
  isSpreadElement as isBabelSpreadElement,
  ObjectExpression,
  SpreadElement,
} from '@babel/types';
import {
  createHandler,
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
  LuaTableConstructor,
  LuaTableKeyField,
  tableConstructor,
} from '@js-to-lua/lua-types';
import { splitBy } from '@js-to-lua/shared-utils';
import {
  NoSpreadObjectProperty,
  ObjectExpressionProperty,
} from './object-expression.types';

export const createObjectExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  objectFieldHandlerFunction: HandlerFunction<
    LuaTableKeyField,
    NoSpreadObjectProperty
  >
) => {
  const handleObjectExpressionWithSpread = createHandlerFunction(
    (source, config, expression: ObjectExpression): LuaCallExpression => {
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

  const handleObjectExpressionWithoutSpread = createHandlerFunction(
    (source, config, expression: ObjectExpression): LuaTableConstructor =>
      tableConstructor(
        expression.properties.map(objectFieldHandlerFunction(source, config))
      ),
    { skipComments: true }
  );

  return createHandler(
    'ObjectExpression',
    (source, config, expression: ObjectExpression) =>
      expression.properties.every((prop) => prop.type !== 'SpreadElement')
        ? handleObjectExpressionWithoutSpread(source, config, expression)
        : handleObjectExpressionWithSpread(source, config, expression)
  );
};

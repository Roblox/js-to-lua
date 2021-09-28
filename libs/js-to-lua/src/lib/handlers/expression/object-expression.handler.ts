import {
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../../types';
import {
  Expression,
  isSpreadElement as isBabelSpreadElement,
  ObjectExpression,
  SpreadElement,
} from '@babel/types';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
  LuaTableConstructor,
  LuaTableKeyField,
  objectAssign,
  tableConstructor,
} from '@js-to-lua/lua-types';
import { splitBy, Unpacked } from '@js-to-lua/shared-utils';

type ObjectExpressionProperty = Unpacked<ObjectExpression['properties']>;

// TODO deduplicate
type NoSpreadObjectProperty = Exclude<
  Unpacked<ObjectExpression['properties']>,
  SpreadElement
>;

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
        return Array.isArray(group)
          ? {
              type: 'TableConstructor',
              elements: group.map(objectFieldHandlerFunction(source, config)),
            }
          : expressionHandlerFunction(source, config, group.argument);
      });

      return callExpression(objectAssign(), [tableConstructor([]), ...args]);
    }
  );

  const handleObjectExpressionWithoutSpread = createHandlerFunction(
    (source, config, expression: ObjectExpression): LuaTableConstructor => ({
      type: 'TableConstructor',
      elements: expression.properties.map(
        objectFieldHandlerFunction(source, config)
      ),
    })
  );

  return createHandler(
    'ObjectExpression',
    (source, config, expression: ObjectExpression) =>
      expression.properties.every((prop) => prop.type !== 'SpreadElement')
        ? handleObjectExpressionWithoutSpread(source, config, expression)
        : handleObjectExpressionWithSpread(source, config, expression)
  );
};

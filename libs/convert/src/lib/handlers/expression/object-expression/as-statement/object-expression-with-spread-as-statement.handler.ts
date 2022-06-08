import {
  Expression,
  isSpreadElement as isBabelSpreadElement,
  ObjectExpression,
  SpreadElement,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  asStatementReturnTypeInline,
  createAsStatementHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturn,
  objectAssign,
  objectNone,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  isNilLiteral,
  isTableNoKeyField,
  LuaCallExpression,
  LuaExpression,
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
  tableConstructor,
} from '@js-to-lua/lua-types';
import { splitBy } from '@js-to-lua/shared-utils';
import {
  NoSpreadObjectProperty,
  ObjectExpressionProperty,
} from '../object-expression.types';
import { extractTableConstructorField } from './single-field-table-constructor-to-return';

export const createObjectExpressionWithSpreadAsStatementHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  objectFieldHandlerAsStatementFunction: AsStatementHandlerFunction<
    LuaStatement,
    NoSpreadObjectProperty,
    LuaTableConstructor<[LuaTableKeyField]>
  >
) => {
  return createAsStatementHandlerFunction<
    LuaStatement,
    ObjectExpression,
    LuaCallExpression
  >(
    (source, config, expression) => {
      const propertiesGroups = expression.properties.reduce(
        splitBy<ObjectExpressionProperty, SpreadElement>(isBabelSpreadElement),
        []
      );
      const args: LuaExpression[] = propertiesGroups.map((group) => {
        const toField = objectFieldHandlerAsStatementFunction(source, config);
        return Array.isArray(group)
          ? tableConstructor(
              group
                .map(toField)
                .map(asStatementReturnTypeToReturn)
                .map(extractTableConstructorField)
                .map((field) =>
                  isTableNoKeyField(field) || !isNilLiteral(field.value)
                    ? field
                    : { ...field, value: objectNone() }
                )
            )
          : expressionHandlerFunction(source, config, group.argument);
      });

      return asStatementReturnTypeInline(
        [],
        callExpression(objectAssign(), [tableConstructor([]), ...args]),
        []
      );
    },
    { skipComments: true }
  );
};

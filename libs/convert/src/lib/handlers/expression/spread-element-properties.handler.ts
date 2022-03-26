import {
  Expression,
  isArrayExpression as isBabelArrayExpression,
  isSpreadElement,
  SpreadElement,
} from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { arrayConcat, arraySpread } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
  LuaTableNoKeyField,
  tableConstructor,
  tableNoKeyField,
} from '@js-to-lua/lua-types';

export const createSpreadElementPropertiesHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  const handleExpressionTableNoKeyFieldHandler: HandlerFunction<
    LuaTableNoKeyField,
    Expression
  > = createHandlerFunction((source, config, expression: Expression) =>
    tableNoKeyField(handleExpression(source, config, expression))
  );

  const handleSpreadExpression: HandlerFunction<LuaExpression, SpreadElement> =
    createHandlerFunction((source, config, spreadElement: SpreadElement) =>
      isBabelArrayExpression(spreadElement.argument)
        ? handleExpression(source, config, spreadElement.argument)
        : callExpression(arraySpread(), [
            handleExpression(source, config, spreadElement.argument),
          ])
    );

  function spreadElementPropertiesHandler(
    source: string,
    config: { forceConcat: true },
    propertiesGroups: (SpreadElement | Expression[])[]
  ): LuaCallExpression;
  function spreadElementPropertiesHandler(
    source: string,
    config: { forceConcat?: false },
    propertiesGroups: (SpreadElement | Expression[])[]
  ): LuaExpression[] | LuaCallExpression;
  function spreadElementPropertiesHandler(
    source: string,
    config: { forceConcat?: boolean },
    propertiesGroups: (SpreadElement | Expression[])[]
  ): LuaExpression[] | LuaCallExpression {
    const needsConcat =
      config.forceConcat ||
      propertiesGroups.some(
        (group, index, arr) => isSpreadElement(group) && index < arr.length - 1
      );

    const args: LuaExpression[] = propertiesGroups
      .map((group): LuaExpression[] | LuaExpression => {
        const handle = handleExpressionTableNoKeyFieldHandler(source, config);
        return Array.isArray(group)
          ? needsConcat
            ? tableConstructor(group.map(handle))
            : group.map(handle).map((tableNoKey) => tableNoKey.value)
          : handleSpreadExpression(source, config, group);
      })
      .flat();

    return needsConcat
      ? callExpression(arrayConcat(), [tableConstructor([]), ...args])
      : args;
  }

  return spreadElementPropertiesHandler;
};

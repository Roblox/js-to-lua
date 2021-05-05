import { BaseNodeHandler } from '../types';
import {
  ArrayExpression,
  Expression,
  ExpressionStatement,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  PatternLike,
  SpreadElement,
} from '@babel/types';
import { combineHandlers } from '../utils/combine-handlers';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { handleStringLiteral } from './primitives/string.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';
import { handleIdentifier } from './identifier.handler';
import { handleNullLiteral } from './primitives/null.handler';
import {
  LuaExpression,
  LuaExpressionStatement,
  LuaIdentifier,
  LuaTableConstructor,
  LuaTableExpressionKeyField,
  LuaTableField,
  LuaTableKeyField,
  LuaTableNoKeyField,
} from '../lua-nodes.types';
import { defaultHandler } from '../utils/default.handler';

export const handleExpressionStatement: BaseNodeHandler<
  ExpressionStatement,
  LuaExpressionStatement
> = {
  type: 'ExpressionStatement',
  handler: (statement) => ({
    type: 'ExpressionStatement',
    expression: handleExpression.handler(statement.expression),
  }),
};

export const handleArrayExpression: BaseNodeHandler<
  ArrayExpression,
  LuaTableConstructor
> = {
  type: 'ArrayExpression',
  handler: ({ elements }) => {
    const handleExpressionTableNoKeyField: BaseNodeHandler<
      Expression,
      LuaTableNoKeyField
    > = {
      type: handleExpression.type,
      handler: (expression) => ({
        type: 'TableNoKeyField',
        value: handleExpression.handler(expression),
      }),
    };

    return {
      type: 'TableConstructor',
      elements: elements.map(handleExpressionTableNoKeyField.handler),
    };
  },
};

export const handleObjectExpression: BaseNodeHandler<
  ObjectExpression,
  LuaTableConstructor
> = {
  type: 'ObjectExpression',
  handler: (expression) => {
    return {
      type: 'TableConstructor',
      elements: expression.properties.map(handleObjectField.handler),
    };
  },
};

export const handleExpression = combineHandlers<
  BaseNodeHandler<Expression, LuaExpression>
>([
  handleNumericLiteral,
  handleStringLiteral,
  handleBooleanLiteral,
  handleArrayExpression,
  handleObjectExpression,
  handleIdentifier,
  handleNullLiteral,
]);

const handleObjectPropertyValue: BaseNodeHandler<
  Expression | PatternLike,
  LuaExpression
> = combineHandlers([handleExpression]);

export const handleObjectProperty: BaseNodeHandler<
  ObjectProperty,
  LuaTableKeyField
> = {
  type: 'ObjectProperty',
  handler: ({ key, value }) => {
    switch (key.type) {
      case 'Identifier':
        return {
          type: 'TableNameKeyField',
          key: handleIdentifier.handler(key) as LuaIdentifier,
          value: handleObjectPropertyValue.handler(value),
        };
      default:
        return {
          type: 'TableExpressionKeyField',
          key: handleExpression.handler(key),
          value: handleObjectPropertyValue.handler(value),
        };
    }
  },
};

export const handleObjectMethod: BaseNodeHandler<
  ObjectMethod,
  LuaTableKeyField
> = {
  type: 'ObjectMethod',
  handler: ({ key, body }): LuaTableKeyField => {
    switch (key.type) {
      case 'Identifier':
        return {
          type: 'TableNameKeyField',
          key: handleIdentifier.handler(key) as LuaIdentifier,
          value: defaultHandler(body) as any, // TODO handle block to function expression
        };
      default:
        return {
          type: 'TableExpressionKeyField',
          key: handleExpression.handler(key),
          value: defaultHandler(body) as any, // TODO handle block to function expression
        };
    }
  },
};

export const handleSpread: BaseNodeHandler<
  SpreadElement,
  LuaTableExpressionKeyField
> = {
  type: 'SpreadElement',
  handler: (node) => {
    return defaultHandler(node) as any; // TODO: handle SpreadElement
  },
};

export const handleObjectField = combineHandlers<
  BaseNodeHandler<ObjectMethod | ObjectProperty | SpreadElement, LuaTableField>
>([handleObjectProperty, handleObjectMethod, handleSpread]);

import { BaseNodeHandler } from '../types';
import {
  ArrayExpression,
  Expression,
  ExpressionStatement,
  CallExpression,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  PatternLike,
  SpreadElement,
  V8IntrinsicIdentifier,
  Identifier,
  BinaryExpression,
} from '@babel/types';
import { combineHandlers } from '../utils/combine-handlers';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { handleStringLiteral } from './primitives/string.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';
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
  LuaCallExpression,
  LuaNilLiteral,
  LuaBinaryExpression,
  LuaBinaryExpressionOperator,
  UnhandledNode,
} from '../lua-nodes.types';
import { defaultHandler } from '../utils/default.handler';
import { typesHandler } from './type-annotation.handler';

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

export const handleCallExpression: BaseNodeHandler<
  CallExpression,
  LuaCallExpression
> = {
  type: 'CallExpression',
  handler: (expression) => {
    return {
      type: 'CallExpression',
      callee: handleCalleeExpression.handler(expression.callee),
      arguments: expression.arguments.map(handleExpression.handler),
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

export const handleIdentifier: BaseNodeHandler<
  Identifier,
  LuaNilLiteral | LuaIdentifier
> = {
  type: 'Identifier',
  handler: (node) => {
    switch (node.name) {
      case 'undefined':
        return {
          type: 'NilLiteral',
        };
      case 'Infinity':
        return {
          type: 'Identifier',
          name: 'math.huge',
        };
      case 'and':
      case 'break':
      case 'do':
      case 'else':
      case 'elseif':
      case 'end':
      case 'false':
      case 'for':
      case 'function':
      case 'if':
      case 'in':
      case 'local':
      case 'nil':
      case 'not':
      case 'or':
      case 'repeat':
      case 'return':
      case 'then':
      case 'true':
      case 'until':
      case 'while':
        return {
          type: 'Identifier',
          name: `${node.name}_`,
        };
      default:
        return {
          type: 'Identifier',
          name: node.name,
          ...(node.typeAnnotation
            ? { typeAnnotation: typesHandler(node.typeAnnotation) }
            : {}),
        };
    }
  },
};

const handleBinaryExpressionOperator = (
  node: BinaryExpression
): LuaBinaryExpressionOperator => {
  if (node.operator === '**') {
    return '^';
  }

  if (
    node.operator === '+' &&
    node.left.type === 'StringLiteral' &&
    node.right.type === 'StringLiteral'
  ) {
    return '..';
  }

  return node.operator as LuaBinaryExpressionOperator;
};

export const handleBinaryExpression: BaseNodeHandler<
  BinaryExpression,
  LuaBinaryExpression | UnhandledNode
> = {
  type: 'BinaryExpression',
  handler: (node) => {
    switch (node.operator) {
      case '**':
      case '+':
      case '-':
      case '/':
      case '*':
      case '%':
        return {
          type: 'LuaBinaryExpression',
          operator: handleBinaryExpressionOperator(node),
          left: handleExpression.handler(node.left as Expression),
          right: handleExpression.handler(node.right),
        };

      default:
        return {
          type: 'UnhandledNode',
          start: node.start,
          end: node.end,
        };
    }
  },
};

export const handleExpression = combineHandlers<
  BaseNodeHandler<Expression, LuaExpression>
>([
  handleNumericLiteral,
  handleStringLiteral,
  handleBooleanLiteral,
  handleArrayExpression,
  handleCallExpression,
  handleObjectExpression,
  handleIdentifier,
  handleNullLiteral,
  handleBinaryExpression,
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

const handleCalleeExpression = combineHandlers<
  BaseNodeHandler<Expression | V8IntrinsicIdentifier, LuaExpression>
>([handleExpression]);

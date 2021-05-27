import { BaseNodeHandler, HandlerFunction } from '../types';
import {
  ArrayExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  ExpressionStatement,
  Identifier,
  isSpreadElement,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  PatternLike,
  SpreadElement,
  V8IntrinsicIdentifier,
  FunctionExpression,
  Statement,
  Declaration,
  VariableDeclarator,
  FunctionDeclaration,
  VariableDeclaration,
  UnaryExpression,
} from '@babel/types';
import { combineHandlers } from '../utils/combine-handlers';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { handleStringLiteral } from './primitives/string.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';
import { handleNullLiteral } from './primitives/null.handler';
import {
  LuaBinaryExpression,
  LuaBinaryExpressionOperator,
  LuaCallExpression,
  LuaExpression,
  LuaExpressionStatement,
  LuaIdentifier,
  LuaNilLiteral,
  LuaTableConstructor,
  LuaTableField,
  LuaTableKeyField,
  LuaTableNoKeyField,
  LuaUnaryExpression,
  UnhandledNode,
  LuaFunctionExpression,
  LuaDeclaration,
  LuaVariableDeclarator,
  LuaFunctionDeclaration,
  LuaVariableDeclaration,
  LuaUnaryVoidExpression,
  LuaUnaryNegationExpression,
  callExpression,
  identifier,
  unaryExpression,
  unaryVoidExpression,
  unaryNegationExpression,
  unhandledNode,
} from '@js-to-lua/lua-types';
import { defaultHandler } from '../utils/default.handler';
import { handleMultilineStringLiteral } from './multiline-string.handler';
import { typesHandler } from './type-annotation.handler';
import { functionParamsHandler } from './function-params.handler';
import { lValHandler } from './l-val.handler';
import { handleTypeAliasDeclaration } from './type-alias-declaration.handler';
import { handleBlockStatement } from './block-statement.handler';
import { splitBy } from '../utils/split-by';
import { Unpacked } from '../utils/types';

type NoSpreadObjectProperty = Exclude<
  Unpacked<ObjectExpression['properties']>,
  SpreadElement
>;
type ObjectExpressionProperty = Unpacked<ObjectExpression['properties']>;
type ArrayExpressionElement = Unpacked<ArrayExpression['elements']>;

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

const handleExpressionTableNoKeyFieldHandler: HandlerFunction<
  Expression,
  LuaTableNoKeyField
> = (expression) => ({
  type: 'TableNoKeyField',
  value: handleExpression.handler(expression),
});

const handleSpreadExpression: HandlerFunction<SpreadElement, LuaExpression> = (
  spreadElement
) =>
  spreadElement.argument.type === 'ArrayExpression'
    ? handleExpression.handler(spreadElement.argument)
    : {
        type: 'CallExpression',
        callee: {
          // TODO: Replace identifier with member expression.
          type: 'Identifier',
          name: 'Array.spread',
        },
        arguments: [handleExpression.handler(spreadElement.argument)],
      };

const handleArrayExpressionWithSpread: HandlerFunction<
  ArrayExpression,
  LuaCallExpression
> = (expression) => {
  const propertiesGroups = expression.elements
    .filter(Boolean)
    .reduce(
      splitBy<ArrayExpressionElement, SpreadElement>(isSpreadElement),
      []
    );
  const args: LuaExpression[] = propertiesGroups.map((group) => {
    return Array.isArray(group)
      ? {
          type: 'TableConstructor',
          elements: group.map(handleExpressionTableNoKeyFieldHandler),
        }
      : handleSpreadExpression(group);
  });

  // TODO: Replace identifier with member expression.
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'Array.concat',
    },
    arguments: [
      {
        type: 'TableConstructor',
        elements: [],
      },
      ...args,
    ],
  };
};

type ArrayExpressionWithoutSpread = ArrayExpression;

const handleArrayExpressionWithoutSpread: HandlerFunction<
  ArrayExpressionWithoutSpread,
  LuaTableConstructor
> = ({ elements }) => {
  return {
    type: 'TableConstructor',
    elements: elements.map(handleExpressionTableNoKeyFieldHandler),
  };
};

export const handleArrayExpression: BaseNodeHandler<
  ArrayExpression,
  LuaTableConstructor | LuaCallExpression
> = {
  type: 'ArrayExpression',
  handler: (expression) => {
    return expression.elements.every(
      (element) => element.type !== 'SpreadElement'
    )
      ? handleArrayExpressionWithoutSpread(expression)
      : handleArrayExpressionWithSpread(expression);
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

const handleObjectExpressionWithSpread: HandlerFunction<
  ObjectExpression,
  LuaCallExpression
> = (expression) => {
  const propertiesGroups = expression.properties.reduce(
    splitBy<ObjectExpressionProperty, SpreadElement>(isSpreadElement),
    []
  );
  const args: LuaExpression[] = propertiesGroups.map((group) => {
    return Array.isArray(group)
      ? {
          type: 'TableConstructor',
          elements: group.map(handleObjectField.handler),
        }
      : handleExpression.handler(group.argument);
  });

  // TODO: Replace identifier with member expression.
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'Object.assign',
    },
    arguments: [
      {
        type: 'TableConstructor',
        elements: [],
      },
      ...args,
    ],
  };
};
const handleObjectExpressionWithoutSpread: HandlerFunction<
  ObjectExpression,
  LuaTableConstructor
> = (expression) => ({
  type: 'TableConstructor',
  elements: expression.properties.map(handleObjectField.handler),
});

export const handleObjectExpression: BaseNodeHandler<
  ObjectExpression,
  LuaTableConstructor | LuaCallExpression
> = {
  type: 'ObjectExpression',
  handler: (expression) =>
    expression.properties.every((prop) => prop.type !== 'SpreadElement')
      ? handleObjectExpressionWithoutSpread(expression)
      : handleObjectExpressionWithSpread(expression),
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

const handleUnaryExpression: BaseNodeHandler<
  UnaryExpression,
  | LuaUnaryExpression
  | LuaUnaryVoidExpression
  | LuaUnaryNegationExpression
  | LuaCallExpression
  | UnhandledNode
> = {
  type: 'UnaryExpression',
  handler: (node: UnaryExpression) => {
    switch (node.operator) {
      case 'typeof':
        return callExpression(identifier('typeof'), [
          handleExpression.handler(node.argument),
        ]);
      case '+':
        return callExpression(identifier('tonumber'), [
          handleExpression.handler(node.argument),
        ]);
      case '-':
        return unaryExpression(
          node.operator,
          handleExpression.handler(node.argument)
        );
      case 'void':
        return unaryVoidExpression(handleExpression.handler(node.argument));
      case '!':
        return unaryNegationExpression(handleExpression.handler(node.argument));
      default:
        return unhandledNode(node.start, node.end);
    }
  },
};

export const handleFunctionExpression: BaseNodeHandler<
  FunctionExpression,
  LuaFunctionExpression
> = {
  type: 'FunctionExpression',
  handler: (node) => {
    return {
      type: 'FunctionExpression',
      params: node.params.map(functionParamsHandler),
      // TODO: Should map to a handler like the functionParamsHandler above, but to do that we need to support AssignmentPattern, which isn't scheduled until a later milestone.
      defaultValues: node.params.filter(
        (param) => param.type === 'AssignmentPattern'
      ),
      body: node.body.body.map(handleStatement.handler),
    };
  },
};

export const handleExpression = combineHandlers<
  BaseNodeHandler<Expression, LuaExpression>
>([
  handleNumericLiteral,
  handleStringLiteral,
  handleMultilineStringLiteral,
  handleBooleanLiteral,
  handleArrayExpression,
  handleCallExpression,
  handleObjectExpression,
  handleIdentifier,
  handleUnaryExpression,
  handleNullLiteral,
  handleBinaryExpression,
  handleFunctionExpression,
]);

const handleObjectPropertyValue: BaseNodeHandler<
  Expression | PatternLike,
  LuaExpression
> = combineHandlers([handleExpression]);

const handleObjectKeyExpression: BaseNodeHandler<
  Expression,
  LuaExpression
>['handler'] = (key) =>
  key.type === 'StringLiteral'
    ? handleExpression.handler(key)
    : {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'tostring',
        },
        arguments: [handleExpression.handler(key)],
      };

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
          key: handleObjectKeyExpression(key),
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
          key: handleObjectKeyExpression(key),
          value: defaultHandler(body) as any, // TODO handle block to function expression
        };
    }
  },
};

export const handleObjectField = combineHandlers<
  BaseNodeHandler<NoSpreadObjectProperty, LuaTableField>
>([handleObjectProperty, handleObjectMethod]);

const handleCalleeExpression = combineHandlers<
  BaseNodeHandler<Expression | V8IntrinsicIdentifier, LuaExpression>
>([handleExpression]);

const handleVariableDeclarator: BaseNodeHandler<
  VariableDeclarator,
  LuaVariableDeclarator
> = {
  type: 'VariableDeclarator',
  handler: (node: VariableDeclarator) => {
    return {
      type: 'VariableDeclarator',
      id: lValHandler(node.id),
      init: node.init ? handleExpression.handler(node.init) : null,
    };
  },
};

export const handleVariableDeclaration: BaseNodeHandler<
  VariableDeclaration,
  LuaVariableDeclaration
> = {
  type: 'VariableDeclaration',
  handler: (declaration) => {
    return {
      type: 'VariableDeclaration',
      ...declaration.declarations
        .map(handleVariableDeclarator.handler)
        .reduceRight(
          (obj, declarator) => {
            obj.identifiers.unshift({
              type: 'VariableDeclaratorIdentifier',
              value: declarator.id,
            });
            if (declarator.init !== null || obj.values.length > 0) {
              obj.values.unshift({
                type: 'VariableDeclaratorValue',
                value: declarator.init,
              });
            }
            return obj;
          },
          { identifiers: [], values: [] }
        ),
    };
  },
};

export const handleFunctionDeclaration: BaseNodeHandler<
  FunctionDeclaration,
  LuaFunctionDeclaration
> = {
  type: 'FunctionDeclaration',
  handler: (node) => {
    return {
      type: 'FunctionDeclaration',
      id: handleIdentifier.handler(node.id) as LuaIdentifier,
      params: node.params.map(functionParamsHandler),
      // TODO: Should map to a handler like the functionParamsHandler above, but to do that we need to support AssignmentPattern, which isn't scheduled until a later milestone.
      defaultValues: node.params.filter(
        (param) => param.type === 'AssignmentPattern'
      ),
      body: node.body.body.map(handleStatement.handler),
      ...(node.returnType ? { returnType: typesHandler(node.returnType) } : {}),
    };
  },
};

export const handleDeclaration = combineHandlers<
  BaseNodeHandler<Declaration, LuaDeclaration>
>([
  handleVariableDeclaration,
  handleFunctionDeclaration,
  handleTypeAliasDeclaration,
]);

export const handleStatement = combineHandlers<BaseNodeHandler<Statement>>([
  handleExpressionStatement,
  handleDeclaration,
  handleBlockStatement,
]);

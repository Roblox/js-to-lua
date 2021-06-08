import { BaseNodeHandler, HandlerFunction } from '../types';
import {
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
  ArrowFunctionExpression,
  UpdateExpression,
  MemberExpression,
} from '@babel/types';
import { combineHandlers } from '../utils/combine-handlers';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { handleStringLiteral } from './primitives/string.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';
import { handleNullLiteral } from './primitives/null.handler';
import {
  LuaBinaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaExpressionStatement,
  LuaIdentifier,
  LuaNilLiteral,
  LuaTableConstructor,
  LuaTableField,
  LuaTableKeyField,
  UnhandledNode,
  LuaFunctionExpression,
  LuaDeclaration,
  LuaVariableDeclarator,
  LuaFunctionDeclaration,
  LuaVariableDeclaration,
  LuaNode,
  callExpression,
  identifier,
  unhandledNode,
  returnStatement,
  functionExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  binaryExpression,
  LuaStringLiteral,
  memberExpression,
  LuaMemberExpression,
  objectAssign,
  tableConstructor,
  numericLiteral,
  functionDeclaration,
  LuaNodeGroup,
} from '@js-to-lua/lua-types';

import { handleMultilineStringLiteral } from './multiline-string.handler';
import { typesHandler } from './type-annotation.handler';
import { functionParamsHandler } from './function-params.handler';
import { lValHandler } from './l-val.handler';
import { handleTypeAliasDeclaration } from './type-alias-declaration.handler';
import { handleBlockStatement } from './block-statement.handler';
import { splitBy } from '../utils/split-by';
import { Unpacked } from '../utils/types';
import { handleReturnStatement } from './return-statement.handler';
import { createArrayExpressionHandler } from './array-expression.handler';
import { forwardHandlerRef } from '../utils/forward-handler-ref';
import { createMemberExpressionHandler } from './member-expression.handler';
import { createUnaryExpressionHandler } from './unary-expression.handler';

export const USE_DOT_NOTATION_IN_CALL_EXPRESSION = ['React'];

type NoSpreadObjectProperty = Exclude<
  Unpacked<ObjectExpression['properties']>,
  SpreadElement
>;
type ObjectExpressionProperty = Unpacked<ObjectExpression['properties']>;

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

export const handleCallExpression: BaseNodeHandler<
  CallExpression,
  LuaCallExpression
> = {
  type: 'CallExpression',
  handler: (expression) => {
    if (
      expression.callee.type !== 'MemberExpression' ||
      USE_DOT_NOTATION_IN_CALL_EXPRESSION.some((identifierName) =>
        matchesMemberExpressionObject(
          identifierName,
          expression.callee as MemberExpression
        )
      )
    ) {
      return callExpression(
        handleCalleeExpression.handler(expression.callee),
        expression.arguments.map(handleExpression.handler)
      );
    }

    if (
      matchesMemberExpressionProperty('toString', expression.callee) &&
      !expression.arguments.length
    ) {
      return callExpression(identifier('tostring'), [
        handleCalleeExpression.handler(expression.callee.object),
      ]);
    }

    if (expression.callee.computed) {
      return callExpression(handleCalleeExpression.handler(expression.callee), [
        handleCalleeExpression.handler(expression.callee.object),
        ...(expression.arguments.map(
          handleExpression.handler
        ) as LuaExpression[]),
      ]);
    }

    return callExpression(
      memberExpression(
        handleExpression.handler(expression.callee.object),
        ':',
        handleExpression.handler(expression.callee.property)
      ),
      expression.arguments.map(handleExpression.handler)
    );
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

  return callExpression(objectAssign(), [tableConstructor([]), ...args]);
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
  LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression
> = {
  type: 'Identifier',
  handler: (node) => {
    switch (node.name) {
      case 'undefined':
        return {
          type: 'NilLiteral',
        };
      case 'Infinity':
        return memberExpression(identifier('math'), '.', identifier('huge'));
      case 'NaN':
        return binaryExpression(numericLiteral(0), '/', numericLiteral(0));
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

const handleBinaryAddOperator = (node) => {
  if (
    node.left.type === 'StringLiteral' ||
    node.right.type === 'StringLiteral'
  ) {
    return binaryExpression(
      handleExpression.handler(handleOperandAsString(node.left as Expression)),
      '..',
      handleExpression.handler(handleOperandAsString(node.right))
    );
  } else {
    return binaryExpression(
      handleExpression.handler(node.left as Expression),
      node.operator,
      handleExpression.handler(node.right)
    );
  }
};

export const handleBinaryExpression: BaseNodeHandler<
  BinaryExpression,
  LuaBinaryExpression | UnhandledNode
> = {
  type: 'BinaryExpression',
  handler: (node) => {
    switch (node.operator) {
      case '-':
      case '/':
      case '*':
      case '%':
        return binaryExpression(
          handleExpression.handler(node.left as Expression),
          node.operator,
          handleExpression.handler(node.right)
        );
      case '**':
        return binaryExpression(
          handleExpression.handler(node.left as Expression),
          '^',
          handleExpression.handler(node.right)
        );
      case '==':
        return binaryExpression(
          handleExpression.handler(node.left as Expression),
          node.operator,
          handleExpression.handler(node.right),
          `ROBLOX CHECK: loose equality used upstream`
        );
      case '!=':
        return binaryExpression(
          handleExpression.handler(node.left as Expression),
          '~=',
          handleExpression.handler(node.right),
          `ROBLOX CHECK: loose inequality used upstream`
        );
      case '===':
        return binaryExpression(
          handleExpression.handler(node.left as Expression),
          '==',
          handleExpression.handler(node.right)
        );
      case '!==':
        return binaryExpression(
          handleExpression.handler(node.left as Expression),
          '~=',
          handleExpression.handler(node.right)
        );
      case '+':
        return handleBinaryAddOperator(node);

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
    return functionExpression(
      node.params.map(functionParamsHandler),
      node.params.filter((param) => param.type === 'AssignmentPattern'),
      node.body.body.map(handleStatement.handler),
      node.returnType ? typesHandler(node.returnType) : null
    );
  },
};

export const handleArrowFunctionExpression: BaseNodeHandler<
  ArrowFunctionExpression,
  LuaFunctionExpression
> = {
  type: 'ArrowFunctionExpression',
  handler: (node) => {
    const body: LuaNode[] =
      node.body.type === 'BlockStatement'
        ? node.body.body.map(handleStatement.handler)
        : [returnStatement(handleExpression.handler(node.body))];

    return functionExpression(
      node.params.map(functionParamsHandler),
      node.params.filter((param) => param.type === 'AssignmentPattern'),
      body,
      node.returnType ? typesHandler(node.returnType) : null
    );
  },
};

export const handleUpdateExpression: BaseNodeHandler<
  UpdateExpression,
  LuaCallExpression
> = {
  type: 'UpdateExpression',
  handler: (node) => {
    const resultName = generateUniqueIdentifier([node.argument], 'result');
    return callExpression(
      node.prefix
        ? functionExpression(
            [],
            [],
            [
              // TODO: must ve replaced by assignementstatement or similar when available
              handleExpression.handler(handlePrefixOperator(node)),
              returnStatement(handleExpression.handler(node.argument)),
            ]
          )
        : functionExpression(
            [],
            [],
            [
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier(resultName))],
                [
                  variableDeclaratorValue(
                    handleExpression.handler(node.argument)
                  ),
                ]
              ),
              // TODO: must ve replaced by assignementstatement or similar when available
              handleExpression.handler(handleSuffixOperator(node)),
              returnStatement(identifier(resultName)),
            ]
          ),
      []
    );
  },
};

export const handleExpression = combineHandlers<
  BaseNodeHandler<Expression, LuaExpression>
>([
  handleNumericLiteral,
  handleStringLiteral,
  handleMultilineStringLiteral,
  handleBooleanLiteral,
  createArrayExpressionHandler(forwardHandlerRef(() => handleExpression)),
  handleCallExpression,
  handleObjectExpression,
  handleIdentifier,
  createUnaryExpressionHandler(forwardHandlerRef(() => handleExpression)),
  handleNullLiteral,
  handleBinaryExpression,
  handleFunctionExpression,
  handleArrowFunctionExpression,
  handleUpdateExpression,
  createMemberExpressionHandler(forwardHandlerRef(() => handleExpression)),
]);

export const handleObjectValueFunctionExpression: BaseNodeHandler<
  FunctionExpression,
  LuaFunctionExpression
> = {
  type: 'FunctionExpression',
  handler: (node) => {
    const params = [
      identifier('self'),
      ...node.params.map(functionParamsHandler),
    ];

    return functionExpression(
      params,
      node.params.filter((param) => param.type === 'AssignmentPattern'),
      node.body.body.map(handleStatement.handler),
      node.returnType ? typesHandler(node.returnType) : null
    );
  },
};

const handleObjectPropertyValue: BaseNodeHandler<
  Expression | PatternLike,
  LuaExpression
> = combineHandlers([handleObjectValueFunctionExpression, handleExpression]);

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
  handler: (node): LuaTableKeyField => {
    const params = [
      identifier('self'),
      ...node.params.map(functionParamsHandler),
    ];
    switch (node.key.type) {
      case 'Identifier':
        return {
          type: 'TableNameKeyField',
          key: handleIdentifier.handler(node.key) as LuaIdentifier,
          value: functionExpression(
            params,
            node.params.filter((param) => param.type === 'AssignmentPattern'),
            node.body.body.map(handleStatement.handler),
            node.returnType ? typesHandler(node.returnType) : null
          ),
        };
      default:
        return {
          type: 'TableExpressionKeyField',
          key: handleObjectKeyExpression(node.key),
          value: functionExpression(
            params,
            node.params.filter((param) => param.type === 'AssignmentPattern'),
            node.body.body.map(handleStatement.handler),
            node.returnType ? typesHandler(node.returnType) : null
          ),
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
  LuaNodeGroup | LuaVariableDeclaration
> = {
  type: 'VariableDeclaration',
  handler: (declaration) => {
    const isFunctionDeclaration = (declaration: VariableDeclarator) =>
      declaration.init &&
      ['FunctionExpression', 'ArrowFunctionExpression'].includes(
        declaration.init.type
      );

    const isNotFunctionDeclaration = (declaration: VariableDeclarator) =>
      !isFunctionDeclaration(declaration);

    const varDeclaration: LuaVariableDeclaration = {
      type: 'VariableDeclaration',
      ...declaration.declarations
        .filter(isNotFunctionDeclaration)
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

    const functionDeclarations = declaration.declarations
      .filter(isFunctionDeclaration)
      .map(convertVariableFunctionToFunctionDeclaration);

    if (functionDeclarations.length === 0) {
      return varDeclaration;
    }

    if (varDeclaration.identifiers.length) {
      return {
        type: 'NodeGroup',
        body: [varDeclaration, ...functionDeclarations],
      };
    }

    return {
      type: 'NodeGroup',
      body: functionDeclarations,
    };
  },
};

const convertVariableFunctionToFunctionDeclaration: HandlerFunction<
  VariableDeclarator,
  LuaFunctionDeclaration | UnhandledNode
> = (node) => {
  switch (node.init.type) {
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      return convertToFunctionDeclaration(
        node.init,
        lValHandler(node.id) as LuaIdentifier
      );
    default:
      return unhandledNode(node.start, node.end);
  }
};

const convertToFunctionDeclaration = (
  node: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression,
  identifier: LuaIdentifier
): LuaFunctionDeclaration => {
  const body: LuaNode[] =
    node.body.type === 'BlockStatement'
      ? node.body.body.map(handleStatement.handler)
      : [returnStatement(handleExpression.handler(node.body))];

  return functionDeclaration(
    identifier,
    node.params.map(functionParamsHandler),
    node.params.filter((param) => param.type === 'AssignmentPattern'),
    body,
    node.returnType ? typesHandler(node.returnType) : null
  );
};

export const handleFunctionDeclaration: BaseNodeHandler<
  FunctionDeclaration,
  LuaFunctionDeclaration
> = {
  type: 'FunctionDeclaration',
  handler: (node) => {
    return convertToFunctionDeclaration(
      node,
      handleIdentifier.handler(node.id) as LuaIdentifier
    );
  },
};

export const handleDeclaration = combineHandlers<
  BaseNodeHandler<Declaration, LuaDeclaration | LuaNodeGroup>
>([
  handleVariableDeclaration,
  handleFunctionDeclaration,
  handleTypeAliasDeclaration,
]);

export const handleStatement = combineHandlers<BaseNodeHandler<Statement>>([
  handleExpressionStatement,
  handleDeclaration,
  handleBlockStatement,
  handleReturnStatement,
]);

// TODO: temporary method, remove later
function handlePrefixOperator(node: UpdateExpression): Expression {
  const temp = { ...node.argument };
  ((temp as unknown) as LuaIdentifier).name +=
    node.operator === '++' ? ' += 1' : ' -= 1';
  return temp;
}

// TODO: temporary method, remove later
function handleSuffixOperator(node: UpdateExpression): Expression {
  ((node.argument as unknown) as LuaIdentifier).name +=
    node.operator === '++' ? ' += 1' : ' -= 1';
  return node.argument;
}

function generateUniqueIdentifier(
  nodes: Expression[],
  defaultValue: string
): string {
  return nodes
    .filter((node) => node.type === 'Identifier')
    .some((node) => (node as Identifier).name === defaultValue)
    ? generateUniqueIdentifier(nodes, `${defaultValue}_`)
    : defaultValue;
}

function handleOperandAsString(
  node: Expression
): LuaCallExpression | LuaStringLiteral {
  if (node.type === 'StringLiteral') {
    return node;
  }
  return callExpression(identifier('tostring'), [
    handleExpression.handler(node),
  ]);
}

function matchesMemberExpressionProperty(
  identifierName: string,
  node: MemberExpression
): boolean {
  return (
    (!node.computed &&
      node.property.type === 'Identifier' &&
      node.property.name === identifierName) ||
    (node.computed &&
      node.property.type === 'StringLiteral' &&
      node.property.value === identifierName)
  );
}

function matchesMemberExpressionObject(
  identifierName: string,
  node: MemberExpression
): boolean {
  return (
    node.object.type === 'Identifier' && node.object.name === identifierName
  );
}

function matchesMemberExpression(
  objectIdentifierName: string,
  propertyIdentifierName: string,
  node: MemberExpression
) {
  return (
    matchesMemberExpressionObject(objectIdentifierName, node) &&
    matchesMemberExpressionProperty(propertyIdentifierName, node)
  );
}

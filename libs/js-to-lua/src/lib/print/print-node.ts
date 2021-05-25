import {
  LuaCallExpression,
  LuaExpression,
  LuaBlockStatement,
  LuaNode,
  LuaProgram,
  LuaTableConstructor,
  LuaTableExpressionKeyField,
  LuaTableNameKeyField,
  LuaTableNoKeyField,
  LuaVariableDeclaration,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
  LuaFunctionDeclaration,
} from '../lua-nodes.types';
import { printNumeric } from './primitives/print-numeric';
import { printString } from './primitives/print-string';
import { printMultilineString } from './primitives/print-multiline-string';

export const printNode = (node: LuaNode, source: string): string => {
  switch (node.type) {
    case 'Program':
      return printProgram(node, source);
    case 'ExpressionStatement':
      return printNode(node.expression, source);
    case 'BlockStatement':
      return printBlockStatement(node, source);
    case 'NumericLiteral':
      return printNumeric(node);
    case 'StringLiteral':
      return printString(node);
    case 'MultilineStringLiteral':
      return printMultilineString(node);
    case 'BooleanLiteral':
      return node.value.toString();
    case 'Identifier':
      return `${node.name}${
        node.typeAnnotation ? printNode(node.typeAnnotation, source) : ''
      }`;
    case 'VariableDeclaration':
      return printVariableDeclaration(node, source);
    case 'VariableDeclaratorIdentifier':
      return printVariableDeclaratorIdentifier(node, source);
    case 'VariableDeclaratorValue':
      return printVariableDeclaratorValue(node, source);
    case 'FunctionDeclaration':
      return `local ${printFunction(node, source)}`;
    case 'FunctionExpression':
      return printFunction(node, source);
    case 'TableConstructor':
      return printTableConstructor(node, source);
    case 'CallExpression':
      return printCallExpression(node, source);
    case 'TableNoKeyField':
      return printTableNoKeyField(node, source);
    case 'TableNameKeyField':
      return printTableKeyField(node, source);
    case 'TableExpressionKeyField':
      return printTableExpressionKeyField(node, source);
    case 'NilLiteral':
      return 'nil';
    case 'LuaTypeAnnotation':
      return `${
        node.typeAnnotation ? `: ${printNode(node.typeAnnotation, source)}` : ''
      }`;
    case 'LuaTypeAny':
      return 'any';
    case 'LuaTypeString':
      return 'string';
    case 'LuaTypeNumber':
      return 'number';
    case 'LuaTypeBoolean':
      return 'boolean';
    case 'LuaTypeVoid':
      return '()';
    case 'LuaTypeAliasDeclaration':
      return printTypeAliasDeclaration(node, source);
    case 'LuaTypeLiteral':
      return printTypeLiteral(node, source);
    case 'LuaPropertySignature':
      return printPropertySignature(node, source);
    case 'LuaBinaryExpression':
      return `${printNode(node.left, source)} ${node.operator} ${printNode(
        node.right,
        source
      )}`;
    case 'UnhandledNode':
      return `
--[[
${source.slice(node.start, node.end)}
]]
      `;
    default:
      return '--[[ default ]]';
  }
};

function printProgram(node: LuaProgram, source: string) {
  const program = node.body.map((node) => printNode(node, source)).join('\n');
  return `${program}\n`;
}

export function printVariableDeclaration(
  node: LuaVariableDeclaration,
  source: string
): string {
  const identifiers = node.identifiers
    .map((id) => printNode(id, source))
    .join(', ');
  const initializers = node.values.length
    ? ` = ${node.values.map((value) => printNode(value, source)).join(', ')}`
    : '';
  return `local ${identifiers}${initializers}`;
}

export function printVariableDeclaratorIdentifier(
  node: LuaVariableDeclaratorIdentifier,
  source: string
): string {
  return printNode(node.value, source);
}

export function printVariableDeclaratorValue(
  node: LuaVariableDeclaratorValue,
  source: string
): string {
  return `${node.value ? `${printNode(node.value, source)}` : 'nil'}`;
}

export function printTableConstructor(
  node: LuaTableConstructor,
  source: string
): string {
  return `{${node.elements.map((e) => printNode(e, source)).join(', ')}}`;
}

function printTableNoKeyField(
  node: LuaTableNoKeyField,
  source: string
): string {
  return printNode(node.value, source);
}

function printTableKeyField(
  node: LuaTableNameKeyField,
  source: string
): string {
  return `${printNode(node.key, source)} = ${printNode(node.value, source)}`;
}

function printTableExpressionKeyField(
  node: LuaTableExpressionKeyField,
  source: string
): string {
  return `[${printNode(node.key, source)}] = ${printNode(node.value, source)}`;
}

export function printBlockStatement(node: LuaBlockStatement, source: string) {
  const blockBody = node.body
    .map((value) => printNode(value, source))
    .join('\n  ');

  if (blockBody.length > 0) {
    return `do
  ${blockBody}
end`;
  }

  return `do
end`;
}

function printCallExpression(node: LuaCallExpression, source: string): string {
  return `${printCalleeExpression(
    node.callee,
    source
  )}(${node.arguments.map((e) => printNode(e, source)).join(', ')})`;
}

function printCalleeExpression(callee: LuaExpression, source: string): string {
  switch (callee.type) {
    case 'CallExpression':
      return `${printNode(callee, source)}`;
    case 'Identifier':
      return `${printNode(callee, source)}`;
    default:
      return `(${printNode(callee, source)})`;
  }
}

function printFunction(node, source) {
  const name = node.id ? ` ${printNode(node.id, source)}` : '';
  const parameters = node.params
    .map((parameter) => printNode(parameter, source))
    .join(', ');
    
  const defaults = node.defaultValues
    .map(
      (assignmentPattern) =>
        `${assignmentPattern.left.name} = ${
          assignmentPattern.left.name
        } == nil and ${printNode(assignmentPattern.right, source)} or ${
          assignmentPattern.left.name
        }`
    )
    .join('\n');

  const body = node.body
    .map((statement) => printNode(statement, source))
    .join('\n');

  const returnType = node.returnType ? printNode(node.returnType, source) : '';

  return `function${name}(${parameters})${returnType}${
    node.defaultValues.length || node.body.length ? '\n' : ' '
  }${defaults}${
    node.defaultValues.length && node.body.length ? '\n' : ''
  }${body}${node.defaultValues.length || node.body.length ? '\n' : ''}end`;
}

function printTypeAliasDeclaration(node, source) {
  return `type ${printNode(node.id, source)} = ${printNode(
    node.typeAnnotation,
    source
  )}`;
}

function printTypeLiteral(node, source) {
  return `{ ${node.members
    .map((member) => printNode(member, source))
    .join(', ')}${node.members.length ? ' ' : ''}}`;
}

function printPropertySignature(node, source) {
  return `${printNode(node.key, source)}${printNode(
    node.typeAnnotation,
    source
  )}`;
}

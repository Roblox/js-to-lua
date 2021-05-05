import {
  LuaNode,
  LuaTableConstructor,
  LuaTableExpressionKeyField,
  LuaTableNameKeyField,
  LuaTableNoKeyField,
  LuaVariableDeclaration,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
} from '../lua-nodes.types';
import { printNumeric } from './primitives/print-numeric';
import { printString } from './primitives/print-string';

export const printNode = (node: LuaNode, source: string): string => {
  switch (node.type) {
    case 'Program':
      return node.body.map((node) => printNode(node, source)).join('\n');
    case 'ExpressionStatement':
      return printNode(node.expression, source);
    case 'NumericLiteral':
      return printNumeric(node);
    case 'StringLiteral':
      return printString(node);
    case 'BooleanLiteral':
      return node.value.toString();
    case 'Identifier':
      return node.name;
    case 'VariableDeclaration':
      return printVariableDeclaration(node, source);
    case 'VariableDeclaratorIdentifier':
      return printVariableDeclaratorIdentifier(node);
    case 'VariableDeclaratorValue':
      return printVariableDeclaratorValue(node, source);
    case 'TableConstructor':
      return printTableConstructor(node, source);
    case 'TableNoKeyField':
      return printTableNoKeyField(node, source);
    case 'TableNameKeyField':
      return printTableKeyField(node, source);
    case 'TableExpressionKeyField':
      return printTableExpressionKeyField(node, source);
    case 'NilLiteral':
      return 'nil';
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

export function printVariableDeclaration(
  node: LuaVariableDeclaration,
  source: string
): string {
  return `local ${node.identifiers
    .map((id) => printNode(id, source))
    .join(', ')}${
    node.values.length
      ? ` = ${node.values.map((value) => printNode(value, source))}`
      : ''
  }`;
}

export function printVariableDeclaratorIdentifier(
  node: LuaVariableDeclaratorIdentifier
): string {
  return node.value.name;
}

export function printVariableDeclaratorValue(
  node: LuaVariableDeclaratorValue,
  source: string
): string {
  return `${node.value ? ` ${printNode(node.value, source)}` : 'nil'}`;
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

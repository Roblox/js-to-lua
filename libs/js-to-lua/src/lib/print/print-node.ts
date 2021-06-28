import {
  BaseLuaNode,
  LuaBlockStatement,
  LuaCallExpression,
  LuaExpression,
  LuaNode,
  LuaProgram,
  LuaReturnStatement,
  LuaTableConstructor,
  LuaTableExpressionKeyField,
  LuaTableNameKeyField,
  LuaTableNoKeyField,
  LuaNodeGroup,
  LuaVariableDeclaration,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
  LuaIfStatement,
  LuaMemberExpression,
} from '@js-to-lua/lua-types';
import { printNumeric } from './primitives/print-numeric';
import { printString } from './primitives/print-string';
import { printMultilineString } from './primitives/print-multiline-string';
import { printIndexExpression } from './print-index-expression';
import { calculateEqualsForDelimiter } from './utils';

export const printNode = (node: LuaNode): string => {
  const nodeStr = _printNode(node);
  const comment = _printConversionComment(node);
  return `${nodeStr}${comment}`;
};

const _printNode = (node: LuaNode): string => {
  switch (node.type) {
    case 'Program':
      return printProgram(node);
    case 'ExpressionStatement':
      return printNode(node.expression);
    case 'BlockStatement':
      return printBlockStatement(node);
    case 'ReturnStatement':
      return printReturnStatement(node);
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
        node.typeAnnotation ? printNode(node.typeAnnotation) : ''
      }`;
    case 'VariableDeclaration':
      return printVariableDeclaration(node);
    case 'NodeGroup':
      return printNodeGroup(node);
    case 'VariableDeclaratorIdentifier':
      return printVariableDeclaratorIdentifier(node);
    case 'VariableDeclaratorValue':
      return printVariableDeclaratorValue(node);
    case 'FunctionDeclaration':
      return `local ${printFunction(node)}`;
    case 'FunctionExpression':
      return printFunction(node);
    case 'TableConstructor':
      return printTableConstructor(node);
    case 'CallExpression':
      return printCallExpression(node);
    case 'TableNoKeyField':
      return printTableNoKeyField(node);
    case 'TableNameKeyField':
      return printTableKeyField(node);
    case 'TableExpressionKeyField':
      return printTableExpressionKeyField(node);
    case 'NilLiteral':
      return 'nil';
    case 'LuaTypeAnnotation':
      return `${
        node.typeAnnotation ? `: ${printNode(node.typeAnnotation)}` : ''
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
      return printTypeAliasDeclaration(node);
    case 'LuaTypeLiteral':
      return printTypeLiteral(node);
    case 'LuaPropertySignature':
      return printPropertySignature(node);
    case 'LuaBinaryExpression':
    case 'LogicalExpression':
      return `${printNode(node.left)} ${node.operator} ${printNode(
        node.right
      )}`;
    case 'LuaUnaryExpression':
      return `${node.operator}${printUnaryOperatorArgument(node.argument)}`;
    case 'LuaUnaryVoidExpression':
      return `${printNode(node.argument)} and nil or nil`;
    case 'LuaUnaryNegationExpression':
      return `not ${printNode(node.argument)}`;
    case 'LuaUnaryDeleteExpression':
      return `${printNode(node.argument)} = nil`;
    case 'IndexExpression':
      return printIndexExpression(node);
    case 'LuaMemberExpression':
      return printMemberExpression(node);
    case 'LuaIfStatement':
      return printIfStatement(node);
    case 'UnhandledStatement':
      return `error("not implemented");`;
    case 'UnhandledExpression':
      return `error("not implemented")`;
    case 'UnhandledTypeAnnotation':
      return ': any';
    default:
      return '--[[ default ]]';
  }
};

const _printConversionComment = ({
  conversionComments,
}: BaseLuaNode): string => {
  return conversionComments
    ? conversionComments
        .map((conversionComment) => ` ${conversionComment} `)
        .map<[string, number]>((conversionComment) => [
          conversionComment,
          calculateEqualsForDelimiter(conversionComment),
        ])
        .map(
          ([conversionComment, numberOfEquals]) =>
            ` --[${'='.repeat(
              numberOfEquals
            )}[${conversionComment}]${'='.repeat(numberOfEquals)}]`
        )
        .join('\n')
    : '';
};

function printProgram(node: LuaProgram) {
  const program = node.body.map((node) => printNode(node)).join('\n');
  return `${program}\n`;
}

export function printNodeGroup(node: LuaNodeGroup): string {
  return node.body.map((node) => printNode(node)).join('\n');
}

export function printVariableDeclaration(node: LuaVariableDeclaration): string {
  const identifiers = node.identifiers.map((id) => printNode(id)).join(', ');
  const initializers = node.values.length
    ? ` = ${node.values.map((value) => printNode(value)).join(', ')}`
    : '';
  return `local ${identifiers}${initializers}`;
}

export function printVariableDeclaratorIdentifier(
  node: LuaVariableDeclaratorIdentifier
): string {
  return printNode(node.value);
}

export function printVariableDeclaratorValue(
  node: LuaVariableDeclaratorValue
): string {
  return `${node.value ? `${printNode(node.value)}` : 'nil'}`;
}

export function printTableConstructor(node: LuaTableConstructor): string {
  return `{${node.elements.map((e) => printNode(e)).join(', ')}}`;
}

function printTableNoKeyField(node: LuaTableNoKeyField): string {
  return printNode(node.value);
}

function printTableKeyField(node: LuaTableNameKeyField): string {
  return `${printNode(node.key)} = ${printNode(node.value)}`;
}

function printTableExpressionKeyField(
  node: LuaTableExpressionKeyField
): string {
  return `[${printNode(node.key)}] = ${printNode(node.value)}`;
}

export function printBlockStatement(node: LuaBlockStatement) {
  const blockBody = node.body.map((value) => printNode(value)).join('\n  ');

  if (blockBody.length > 0) {
    return `do
  ${blockBody}
end`;
  }

  return `do
end`;
}

export function printReturnStatement(node: LuaReturnStatement) {
  return `return ${printNode(node.argument)}`;
}

function printCallExpression(node: LuaCallExpression): string {
  return `${printCalleeExpression(node.callee)}(${node.arguments
    .map((e) => printNode(e))
    .join(', ')})`;
}

function printCalleeExpression(callee: LuaExpression): string {
  switch (callee.type) {
    case 'CallExpression':
    case 'Identifier':
    case 'LuaMemberExpression':
    case 'IndexExpression':
      return `${printNode(callee)}`;
    default:
      return `(${printNode(callee)})`;
  }
}

function printFunction(node) {
  const name = node.id ? ` ${printNode(node.id)}` : '';
  const parameters = node.params
    .map((parameter) => printNode(parameter))
    .join(', ');

  const defaults = node.defaultValues
    .map(
      (assignmentPattern) =>
        `  if ${assignmentPattern.left.name} == nil then
    ${assignmentPattern.left.name} = ${printNode(assignmentPattern.right)}
  end`
    )
    .join('\n');

  const body = node.body.map((statement) => printNode(statement)).join('\n');

  const returnType = node.returnType ? printNode(node.returnType) : '';

  return `function${name}(${parameters})${returnType}${
    node.defaultValues.length || node.body.length ? '\n' : ' '
  }${defaults}${
    node.defaultValues.length && node.body.length ? '\n' : ''
  }${body}${node.defaultValues.length || node.body.length ? '\n' : ''}end`;
}

function printTypeAliasDeclaration(node) {
  return `type ${printNode(node.id)} = ${printNode(node.typeAnnotation)}`;
}

function printTypeLiteral(node) {
  return `{ ${node.members.map((member) => printNode(member)).join(', ')}${
    node.members.length ? ' ' : ''
  }}`;
}

function printPropertySignature(node) {
  return `${printNode(node.key)}${printNode(node.typeAnnotation)}`;
}

const LITERALS = ['StringLiteral', 'NumericLiteral', 'MultilineStringLiteral'];

function printUnaryOperatorArgument(node: LuaExpression): string {
  if ([...LITERALS, 'Identifier'].includes(node.type)) {
    return printNode(node);
  } else {
    return `(${printNode(node)})`;
  }
}

function printMemberExpression(node: LuaMemberExpression): string {
  return `${printMemberBaseExpression(node.base)}${node.indexer}${printNode(
    node.identifier
  )}`;
}

function printMemberBaseExpression(base: LuaExpression): string {
  switch (base.type) {
    case 'TableConstructor':
    case 'UnhandledExpression':
      return `(${printNode(base)})`;
    default:
      return `${printNode(base)}`;
  }
}

function printIfStatement(node: LuaIfStatement): string {
  const consequentStatements = node.consequent.map(printNode);
  const alternateStatement = node.alternate
    ? `else
  ${node.alternate.map(printNode)}`
    : '';
  return `if ${printNode(node.test)} then
  ${consequentStatements}
${alternateStatement}
end
  `;
}

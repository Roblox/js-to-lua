import {
  isBinaryExpression,
  isCommentBlock,
  isElseifClause,
  isFunctionDeclaration,
  isIfClause,
  isLogicalExpression,
  isUnaryNegation,
  LuaBlockStatement,
  LuaCallExpression,
  LuaClause,
  LuaComment,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaFunctionExpression,
  LuaIfStatement,
  LuaMemberExpression,
  LuaNode,
  LuaNodeGroup,
  LuaProgram,
  LuaPropertySignature,
  LuaReturnStatement,
  LuaTableConstructor,
  LuaTableExpressionKeyField,
  LuaTableNameKeyField,
  LuaTableNoKeyField,
  LuaTypeAliasDeclaration,
  LuaTypeLiteral,
  LuaVariableDeclaration,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
  isUnaryExpression,
} from '@js-to-lua/lua-types';
import { printNumeric } from './primitives/print-numeric';
import { printString } from './primitives/print-string';
import { printMultilineString } from './primitives/print-multiline-string';
import { printIndexExpression } from './print-index-expression';
import { calculateEqualsForDelimiter } from './utils';
import { createPrintAssignmentStatement } from './statements/print-assignment-statement';
import { createPrintExportTypeStatement } from './statements/print-export-type-statement';
import { createPrintForGenericStatement } from './statements/print-for-generic-statement';
import { createPrintRepeatStatement } from './statements/print-repeat-statement';
import { anyPass } from 'ramda';

export const printNode = (node: LuaNode): string => {
  const nodeStr = _printNode(node);
  const leadingComments = _printComments(node.leadingComments);
  const trailingComments = _printComments(node.trailingComments);
  return `${leadingComments}${nodeStr}${trailingComments}`;
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
      return `${useParenthesis(node.left, checkPrecedence(node))} ${
        node.operator
      } ${useParenthesis(node.right, checkPrecedence(node))}`;
    case 'LuaUnaryExpression':
      return `${node.operator}${useParenthesis(
        node.argument,
        (childNode: LuaNode) =>
          anyPass([checkPrecedence(node), isUnaryExpression])(childNode)
      )}`;
    case 'LuaUnaryVoidExpression':
      return `${printNode(node.argument)} and nil or nil`;
    case 'LuaUnaryNegationExpression':
      return `not ${useParenthesis(node.argument, checkPrecedence(node))}`;
    case 'LuaUnaryDeleteExpression':
      return `${printNode(node.argument)} = nil`;
    case 'IndexExpression':
      return printIndexExpression(node);
    case 'LuaMemberExpression':
      return printMemberExpression(node);
    case 'LuaIfStatement':
      return printIfStatement(node);
    case 'AssignmentStatement':
      return createPrintAssignmentStatement(printNode)(node);
    case 'ExportTypeStatement':
      return createPrintExportTypeStatement(printNode)(node);
    case 'ForGenericStatement':
      return createPrintForGenericStatement(printNode, _printComments)(node);
    case 'RepeatStatement':
      return createPrintRepeatStatement(printNode, _printComments)(node);
    case 'BreakStatement':
      return 'break';
    case 'UnhandledStatement':
      return `error("not implemented");`;
    case 'UnhandledExpression':
      return `error("not implemented")`;
    case 'UnhandledTypeAnnotation':
      return ': any';
    case 'UnhandledElement':
      return '';
    default:
      return '--[[ default ]]';
  }
};

const _printComments = (
  comments: ReadonlyArray<LuaComment> | undefined
): string => {
  return comments
    ? comments
        .filter(isCommentBlock)
        .map((conversionComment) => ` ${conversionComment.value} `)
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
  const innerComments = _printComments(node.innerComments);

  if (blockBody.length > 0) {
    return `do${innerComments ? ` ${innerComments}` : ''}
  ${blockBody}
end`;
  }

  return `do${innerComments ? ` ${innerComments}` : ''}
end`;
}

export function printReturnStatement(node: LuaReturnStatement) {
  return `return ${node.arguments.map(printNode).join(', ')}`;
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

function printFunction(node: LuaFunctionExpression | LuaFunctionDeclaration) {
  const name = isFunctionDeclaration(node) ? ` ${printNode(node.id)}` : '';
  const parameters = node.params
    .map((parameter) => printNode(parameter))
    .join(', ');

  const body = node.body.map((statement) => printNode(statement)).join('\n');

  const returnType = node.returnType ? printNode(node.returnType) : '';

  return `function${name}(${parameters})${returnType}${
    node.body.length ? '\n' : ' '
  }${body}${node.body.length ? '\n' : ''}end`;
}

function printTypeAliasDeclaration(node: LuaTypeAliasDeclaration) {
  return `type ${printNode(node.id)} = ${printNode(node.typeAnnotation)}`;
}

function printTypeLiteral(node: LuaTypeLiteral) {
  return `{ ${node.members.map((member) => printNode(member)).join(', ')}${
    node.members.length ? ' ' : ''
  }}`;
}

function printPropertySignature(node: LuaPropertySignature) {
  return `${printNode(node.key)}${
    node.typeAnnotation ? printNode(node.typeAnnotation) : ''
  }`;
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
  const clauses = [
    node.ifClause,
    ...(node.elseifClauses ? node.elseifClauses : []),
    ...(node.elseClause ? [node.elseClause] : []),
  ];
  return `${clauses.map(printClause).join('\n')}
end`;
}

function printClause(node: LuaClause): string {
  const body = node.body.map(printNode).join('\n');
  if (isIfClause(node) || isElseifClause(node)) {
    return `${isIfClause(node) ? 'if' : 'elseif'} ${printNode(
      node.condition
    )} then${node.body.length ? ' \n' : ''}${body}`;
  } else {
    return `else${node.body.length ? ' \n' : ''}${body}`;
  }
}

function checkPrecedence(node: LuaNode) {
  return (childNode: LuaNode) =>
    anyPass([
      isBinaryExpression,
      isLogicalExpression,
      isUnaryNegation,
      isUnaryExpression,
    ])(childNode) &&
    anyPass([
      isBinaryExpression,
      isLogicalExpression,
      isUnaryNegation,
      isUnaryExpression,
    ])(node) &&
    getPrecedence(childNode) > getPrecedence(node);
}

function useParenthesis(
  node: LuaNode,
  conditionFn: (node: LuaNode) => boolean
) {
  if (conditionFn(node)) {
    return `(${printNode(node)})`;
  }

  return printNode(node);
}

function getPrecedence(node: LuaNode) {
  if (isBinaryExpression(node) && node.operator === '^') {
    return 1;
  }
  if (
    isUnaryNegation(node) ||
    (isUnaryExpression(node) && node.operator === '-')
  ) {
    return 2;
  }
  if (isBinaryExpression(node) && ['*', '/'].includes(node.operator)) {
    return 3;
  }
  if (isBinaryExpression(node) && ['+', '-'].includes(node.operator)) {
    return 4;
  }
  if (
    isBinaryExpression(node) &&
    ['..', '<', '>', '<=', '>=', '~=', '=='].includes(node.operator)
  ) {
    return 5;
  }
  if (isLogicalExpression(node) && node.operator === 'and') {
    return 6;
  }
  if (isLogicalExpression(node) && node.operator === 'or') {
    return 7;
  }

  return 0;
}

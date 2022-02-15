import {
  isBinaryExpression,
  isCommentBlock,
  isElseifClause,
  isFunctionDeclaration,
  isIfClause,
  isLogicalExpression,
  isUnaryExpression,
  isUnaryNegation,
  LuaBlockStatement,
  LuaCallExpression,
  LuaClause,
  LuaComment,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaFunctionExpression,
  LuaIfStatement,
  LuaNode,
  LuaNodeGroup,
  LuaProgram,
  LuaReturnStatement,
  LuaTableConstructor,
  LuaTableExpressionKeyField,
  LuaTableNameKeyField,
  LuaTableNoKeyField,
  LuaTypeLiteral,
  LuaVariableDeclaration,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { anyPass, last } from 'ramda';
import { createPrintPropertySignature } from './declaration/print-property-signature';
import { createPrintTypeAliasDeclaration } from './declaration/print-type-declaration';
import { createPrintIndexExpression } from './expression/print-index-expression';
import { createPrintMemberExpression } from './expression/print-member-expression';
import { createPrintTypeCastExpression } from './expression/print-type-cast-expression';
import { printMultilineString } from './primitives/print-multiline-string';
import { printNumeric } from './primitives/print-numeric';
import { printString } from './primitives/print-string';
import { createPrintAssignmentStatement } from './statements/print-assignment-statement';
import { createPrintExportTypeStatement } from './statements/print-export-type-statement';
import { createPrintForGenericStatement } from './statements/print-for-generic-statement';
import { createPrintRepeatStatement } from './statements/print-repeat-statement';
import { createPrintWhileStatement } from './statements/print-while-statement';
import { createPrintIndexSignature } from './type/print-index-signature';
import { createPrintTypeFunction } from './type/print-type-function';
import { createPrintTypeIntersection } from './type/print-type-intersection';
import { createPrintTypeOptional } from './type/print-type-optional';
import { createPrintTypeQuery } from './type/print-type-query';
import { createPrintTypeReference } from './type/print-type-reference';
import { createPrintTypeUnion } from './type/print-type-union';
import { calculateEqualsForDelimiter } from './utils';

const printedNodes = new Map();

// Must remove added comment to jsx elements when parsed
const isBabelAddedComment = (comment: LuaComment) =>
  comment.value === '#__PURE__';

export type PrintNode = typeof printNode;

export function printNode<N extends LuaNode | LuaNodeGroup<any>>(
  node: N,
  nodePrintFn: (node: N) => string = _printNode
): string {
  const nodeStr = nodePrintFn(node);

  const filteredLeadingComments = filterLeadingComments(node.leadingComments);
  const leadingComments = _printComments(filteredLeadingComments);

  const filteredTrailingComments = filterTrailingComments(
    node.trailingComments
  );
  const trailingComments = _printComments(filteredTrailingComments);

  const filteredInnerComments = filterInnerComments(node.innerComments);
  const innerComments = _printComments(filteredInnerComments) || '';

  const filteredLeadAndInnerComments = [
    ...filteredLeadingComments,
    ...filteredInnerComments,
  ];

  const leadSeparator = filteredLeadAndInnerComments.length
    ? ['SameLineLeadingComment', 'SameLineInnerComment'].includes(
        last(filteredLeadAndInnerComments)!.loc
      )
      ? ' '
      : '\n'
    : '';

  const trailingSeparator = filteredTrailingComments.length
    ? ['SameLineTrailingComment'].includes(filteredTrailingComments[0].loc)
      ? ' '
      : '\n'
    : '';

  return [
    leadingComments,
    innerComments,
    leadSeparator,
    nodeStr,
    trailingSeparator,
    trailingComments,
  ].join('');
}

const _printNode = (node: LuaNode): string => {
  switch (node.type) {
    case 'Program':
      return printProgram(node);
    case 'ExpressionStatement':
      return `${printNode(node.expression)};`;
    case 'BlockStatement':
      return printBlockStatement(node);
    case 'ReturnStatement':
      return printReturnStatement(node);
    case 'WhileStatement':
      return createPrintWhileStatement(printNode, _printComments)(node);
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
      return printNode(node, printVariableDeclaration);
    case 'NodeGroup':
      return printNodeGroup(node);
    case 'VariableDeclaratorIdentifier':
      return printVariableDeclaratorIdentifier(node);
    case 'VariableDeclaratorValue':
      return printVariableDeclaratorValue(node);
    case 'FunctionDeclaration':
      return `${node.isLocal ? 'local ' : ''}${printFunction(node)}`;
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
      return `: ${printNode(node.typeAnnotation)}`;
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
    case 'LuaTypeUnion':
      return createPrintTypeUnion(printNode)(node);
    case 'LuaTypeIntersection':
      return createPrintTypeIntersection(printNode)(node);
    case 'LuaTypeAliasDeclaration':
      return createPrintTypeAliasDeclaration(printNode)(node);
    case 'LuaTypeLiteral':
      return printNode(node, printTypeLiteral);
    case 'LuaTypeFunction':
      return createPrintTypeFunction(printNode)(node);
    case 'LuaLiteralType':
      return printNode(node.literal);
    case 'LuaPropertySignature':
      return createPrintPropertySignature(printNode)(node);
    case 'LuaIndexSignature':
      return `${printNode(node, createPrintIndexSignature(printNode))}`;
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
    case 'IndexExpression':
      return createPrintIndexExpression(printNode)(node);
    case 'LuaMemberExpression':
      return createPrintMemberExpression(printNode)(node);
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
    case 'TypeCastExpression':
      return createPrintTypeCastExpression(printNode)(node);
    case 'TypeReference':
      return createPrintTypeReference(printNode)(node);
    case 'LuaTypeNil':
      return 'nil';
    case 'LuaTypeOptional':
      return createPrintTypeOptional(printNode)(node);
    case 'LuaTypeQuery':
      return createPrintTypeQuery(printNode)(node);
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
  const isInlineComment = (comment: LuaComment) =>
    [
      'SameLineTrailingComment',
      'SameLineLeadingComment',
      'SameLineInnerComment',
    ].includes(comment.loc);

  const getCommentLeadingSpace = (
    comment: LuaComment,
    index: number,
    prev: LuaComment | null
  ) => {
    return isInlineComment(comment) && comment.loc == prev?.loc
      ? ' '
      : index !== 0
      ? '\n'
      : '';
  };

  return comments
    ? comments
        .map((comment, i) => {
          printedNodes.set(comment, true);
          const prev = i !== 0 ? comments[i - 1] : null;
          const leadingSpace = getCommentLeadingSpace(comment, i, prev);
          if (isCommentBlock(comment)) {
            const numberOfEquals = calculateEqualsForDelimiter(comment.value);
            return `${leadingSpace}--[${'='.repeat(numberOfEquals)}[${
              comment.value
            }]${'='.repeat(numberOfEquals)}]`;
          } else {
            return `${leadingSpace}--${comment.value}`;
          }
        })
        .join('')
    : '';
};

function printProgram(node: LuaProgram) {
  const program = node.body.map((node) => printNode(node)).join('\n');
  const innerComments = _printComments(filterInnerComments(node.innerComments));
  return `${innerComments}${program}\n`;
}

export function printNodeGroup(node: LuaNodeGroup): string {
  const printedBody = node.body
    .map((node) => printNode(node))
    .filter(Boolean)
    .join('\n');

  const innerComments = _printComments(filterInnerComments(node.innerComments));

  return `${innerComments}${printedBody}`;
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
  const innerComments = _printComments(filterInnerComments(node.innerComments));

  if (blockBody.length > 0) {
    return `do${innerComments ? ` ${innerComments}` : ''}
  ${blockBody}
end`;
  }

  return `do${innerComments ? ` ${innerComments}` : ''}
end`;
}

export function printReturnStatement(node: LuaReturnStatement) {
  return `return ${node.arguments.map((arg) => printNode(arg)).join(', ')}`;
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
  const name = isFunctionDeclaration(node)
    ? ` ${printNode({ ...node.id, typeAnnotation: undefined })}`
    : '';
  const parameters = node.params
    .map((parameter) => printNode(parameter))
    .join(', ');

  const returnType = node.returnType ? printNode(node.returnType) : '';

  const body = printNode(node.body);

  const innerComments = _printComments(filterInnerComments(node.innerComments));

  return `function${name}(${parameters})${returnType}${innerComments}${
    body ? `\n${body}` : ''
  }${body || innerComments ? '\n' : ' '}end`;
}

function printTypeLiteral(node: LuaTypeLiteral) {
  return `{ ${node.members.map((member) => printNode(member)).join(', ')}${
    node.members.length ? ' ' : ''
  }}`;
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
  const body = printNode(node.body);
  if (isIfClause(node) || isElseifClause(node)) {
    return `${isIfClause(node) ? 'if' : 'elseif'} ${printNode(
      node.condition
    )} then${body ? `\n${body}` : ''}`;
  } else {
    return `else${body ? `\n${body}` : ''}`;
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

export const filterLeadingComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  comments.filter(
    (n) =>
      !printedNodes.get(n) &&
      !isBabelAddedComment(n) &&
      !['SameLineTrailingComment', 'SameLineInnerComment'].includes(n.loc)
  );

export const filterInnerComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  comments.filter(
    (n) =>
      !printedNodes.get(n) &&
      !isBabelAddedComment(n) &&
      !['SameLineLeadingComment', 'SameLineTrailingComment'].includes(n.loc)
  );

export const filterTrailingComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  comments.filter(
    (n) =>
      !printedNodes.get(n) &&
      !isBabelAddedComment(n) &&
      !['SameLineLeadingComment', 'SameLineInnerComment'].includes(n.loc)
  );

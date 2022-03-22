import {
  isBinaryExpression,
  isCommentBlock,
  isFunctionDeclaration,
  isLogicalExpression,
  isSameLineComment,
  isSameLineInnerComment,
  isSameLineLeadingAndTrailingComment,
  isSameLineLeadingComment,
  isSameLineTrailingComment,
  isUnaryExpression,
  isUnaryNegation,
  LuaBlockStatement,
  LuaCallExpression,
  LuaComment,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaFunctionExpression,
  LuaNode,
  LuaNodeGroup,
  LuaProgram,
  LuaReturnStatement,
  LuaStatement,
  LuaTableConstructor,
  LuaTableExpressionKeyField,
  LuaTableNameKeyField,
  LuaTableNoKeyField,
  LuaVariableDeclaration,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { anyPass, last } from 'ramda';
import { createPrintPropertySignature } from './declaration/print-property-signature';
import { createPrintTypeAliasDeclaration } from './declaration/print-type-declaration';
import { createPrintTypeParameterDeclaration } from './declaration/print-type-parameter-declaration';
import { createPrintIfExpression } from './expression/print-if-expression';
import { createPrintIndexExpression } from './expression/print-index-expression';
import { createPrintMemberExpression } from './expression/print-member-expression';
import { createPrintTypeCastExpression } from './expression/print-type-cast-expression';
import { printMultilineString } from './primitives/print-multiline-string';
import { printNumeric } from './primitives/print-numeric';
import { printString } from './primitives/print-string';
import { createPrintAssignmentStatement } from './statements/print-assignment-statement';
import { createPrintExportTypeStatement } from './statements/print-export-type-statement';
import { createPrintForGenericStatement } from './statements/print-for-generic-statement';
import { createPrintIfStatement } from './statements/print-if-statement';
import { createPrintRepeatStatement } from './statements/print-repeat-statement';
import { createPrintWhileStatement } from './statements/print-while-statement';
import { createPrintIndexSignature } from './type/print-index-signature';
import { createPrintTypeFunction } from './type/print-type-function';
import { createPrintTypeIntersection } from './type/print-type-intersection';
import { createPrintTypeLiteral } from './type/print-type-literal';
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
export type GetPrintSections = typeof getPrintSections;
export type PrintSections = {
  leadingComments: string;
  leadSeparator: string;
  innerComments: string;
  innerSeparator: string;
  nodeStr: string;
  trailingSeparator: string;
  trailingComments: string;
};

export function getPrintSections<N extends LuaNode | LuaNodeGroup<any>>(
  node: N,
  nodePrintFn: (node: N) => string = _printNode
): PrintSections {
  const nodeStr = nodePrintFn(node);

  const printableLeadingComments = getPrintableLeadingComments(
    node.leadingComments
  );
  const leadingComments = _printComments(printableLeadingComments);

  const printableTrailingComments = getPrintableTrailingComments(
    node.trailingComments
  );
  const trailingComments = _printComments(printableTrailingComments);

  const printableInnerComments = getPrintableInnerComments(node.innerComments);
  const innerComments = _printComments(printableInnerComments);

  const leadSeparator = printableLeadingComments.length
    ? [
        isSameLineLeadingComment,
        isSameLineInnerComment,
        isSameLineLeadingAndTrailingComment,
      ].some((predicate) => predicate(last(printableLeadingComments)!))
      ? ' '
      : '\n'
    : '';

  const innerSeparator = printableInnerComments.length
    ? ['SameLineInnerComment'].includes(last(printableInnerComments)!.loc)
      ? ' '
      : '\n'
    : '';

  const trailingSeparator =
    node.trailingComments?.length &&
    isSameLineLeadingAndTrailingComment(node.trailingComments[0])
      ? ' '
      : printableTrailingComments.length
      ? isSameLineTrailingComment(printableTrailingComments[0])
        ? ' '
        : '\n'
      : '';

  return {
    leadingComments,
    leadSeparator,
    innerComments,
    innerSeparator,
    nodeStr,
    trailingSeparator,
    trailingComments,
  };
}
export function printNode<N extends LuaNode | LuaNodeGroup<any>>(
  node: N,
  nodePrintFn: (node: N) => string = _printNode
): string {
  const {
    leadingComments,
    leadSeparator,
    nodeStr,
    trailingSeparator,
    trailingComments,
  } = getPrintSections(node, nodePrintFn);

  return [
    leadingComments,
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
      return createPrintTypeLiteral(printNode, getPrintSections)(node);
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
      return createPrintIfStatement(printNode)(node);
    case 'IfExpression':
      return createPrintIfExpression(printNode)(node);
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
    case 'LuaTypeParameterDeclaration':
      return createPrintTypeParameterDeclaration(printNode)(node);
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
  const getCommentLeadingSpace = (
    comment: LuaComment,
    index: number,
    prev: LuaComment | null
  ) => {
    return isSameLineComment(comment) && comment.loc == prev?.loc
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
  const getTrailingSpace = (innerNode: LuaStatement) => {
    if (innerNode === last(node.body)) {
      return '';
    } else if (
      innerNode.trailingComments?.length &&
      isSameLineLeadingAndTrailingComment(last(innerNode.trailingComments)!)
    ) {
      return ' ';
    }
    return '\n';
  };

  const program = node.body
    .map((innerNode) => `${printNode(innerNode)}${getTrailingSpace(innerNode)}`)
    .join('');
  const innerComments = _printComments(
    getFilteredInnerComments(node.innerComments)
  );
  return `${innerComments}${program}\n`;
}

export function printNodeGroup(node: LuaNodeGroup): string {
  const printedBody = node.body
    .map((node) => printNode(node))
    .filter(Boolean)
    .join('\n');

  const innerComments = _printComments(
    getPrintableInnerComments(node.innerComments)
  );

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
  const innerComments = _printComments(
    getPrintableInnerComments(node.innerComments)
  );

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
    ? ` ${printNode({ ...node.id, typeAnnotation: undefined })}${
        node.typeParams ? printNode(node.typeParams) : ''
      }`
    : '';
  const parameters = node.params
    .map((parameter) => printNode(parameter))
    .join(', ');

  const returnType = node.returnType ? printNode(node.returnType) : '';

  const body = printNode(node.body);

  const innerComments = '';
  _printComments(getPrintableInnerComments(node.innerComments));

  return `function${name}(${parameters})${returnType}${innerComments}${
    body ? `\n${body}\n` : ' '
  }end`;
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

export const getFilteredLeadingComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  comments.filter(
    (n) =>
      !isBabelAddedComment(n) &&
      ![isSameLineTrailingComment, isSameLineInnerComment].some((predicate) =>
        predicate(n)
      )
  );

export const getPrintableLeadingComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  getFilteredLeadingComments(comments).filter((n) => !printedNodes.get(n));

export const getFilteredInnerComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  comments.filter(
    (n) =>
      !isBabelAddedComment(n) &&
      ![
        isSameLineLeadingComment,
        isSameLineTrailingComment,
        isSameLineLeadingAndTrailingComment,
      ].some((predicate) => predicate(n))
  );

export const getPrintableInnerComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  getFilteredInnerComments(comments).filter((n) => !printedNodes.get(n));

export const getFilteredTrailingComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  comments.filter(
    (n) =>
      !isBabelAddedComment(n) &&
      ![
        isSameLineLeadingComment,
        isSameLineInnerComment,
        isSameLineLeadingAndTrailingComment,
      ].some((predicate) => predicate(n))
  );

export const getPrintableTrailingComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  getFilteredTrailingComments(comments).filter((n) => !printedNodes.get(n));

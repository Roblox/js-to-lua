import {
  isFunctionDeclaration,
  isSameLineInnerComment,
  isSameLineLeadingAndTrailingComment,
  isSameLineLeadingComment,
  isSameLineTrailingComment,
  isUnaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaFunctionExpression,
  LuaNode,
  LuaNodeGroup,
} from '@js-to-lua/lua-types';
import { anyPass, last } from 'ramda';
import { checkPrecedence } from './check-precedence';
import { createPrintPropertySignature } from './declaration/print-property-signature';
import { createPrintTypeAliasDeclaration } from './declaration/print-type-declaration';
import { createPrintTypeParameterDeclaration } from './declaration/print-type-parameter-declaration';
import { createPrintVariableDeclaration } from './declaration/variable-declaration/print-variable-declaration';
import { createPrintVariableDeclaratorIdentifier } from './declaration/variable-declaration/print-variable-declarator-identifier';
import { createPrintVariableDeclaratorValue } from './declaration/variable-declaration/print-variable-declarator-value';
import { createPrintIfExpression } from './expression/print-if-expression';
import { createPrintIndexExpression } from './expression/print-index-expression';
import { createPrintMemberExpression } from './expression/print-member-expression';
import { createPrintTypeCastExpression } from './expression/print-type-cast-expression';
import { createPrintTableConstructor } from './expression/table-constructor/print-table-constructor';
import { createPrintTableExpressionKeyField } from './expression/table-constructor/print-table-expression-key-field';
import { createPrintTableKeyField } from './expression/table-constructor/print-table-key-field';
import { createPrintTableNoKeyField } from './expression/table-constructor/print-table-no-key-field';
import { printMultilineString } from './primitives/print-multiline-string';
import { printNumeric } from './primitives/print-numeric';
import { printString } from './primitives/print-string';
import { createPrintProgram } from './print-program';
import {
  _printComments,
  getPrintableInnerComments,
  getPrintableLeadingComments,
  getPrintableTrailingComments,
} from './printable-comments';
import { createPrintAssignmentStatement } from './statements/print-assignment-statement';
import { createPrintBlockStatement } from './statements/print-block-statement';
import { createPrintBreakStatement } from './statements/print-break-statement';
import { createPrintContinueStatement } from './statements/print-continue-statement';
import { createPrintExportTypeStatement } from './statements/print-export-type-statement';
import { createPrintExpressionStatement } from './statements/print-expression-statement';
import { createPrintForGenericStatement } from './statements/print-for-generic-statement';
import { createPrintIfStatement } from './statements/print-if-statement';
import { createPrintNodeGroup } from './statements/print-node-group';
import { createPrintRepeatStatement } from './statements/print-repeat-statement';
import { createPrintReturnStatement } from './statements/print-return-statement';
import { createPrintUnhandledStatement } from './statements/print-unhandled-statement';
import { createPrintWhileStatement } from './statements/print-while-statement';
import { createPrintFunctionReturnType } from './type/print-function-return-type';
import { createPrintIndexSignature } from './type/print-index-signature';
import { createPrintTypeFunction } from './type/print-type-function';
import { createPrintTypeIntersection } from './type/print-type-intersection';
import { createPrintTypeLiteral } from './type/print-type-literal';
import { createPrintTypeOptional } from './type/print-type-optional';
import { createPrintTypeQuery } from './type/print-type-query';
import { createPrintTypeReference } from './type/print-type-reference';
import { createPrintTypeUnion } from './type/print-type-union';
import { createPrintTypeOfExpression } from './type/print-typeof-expression';

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

export function getPrintSections<N extends LuaNode | LuaNodeGroup>(
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

  const lastPrintableLeadingComment = last(printableLeadingComments);
  const leadSeparator = lastPrintableLeadingComment
    ? [
        isSameLineLeadingComment,
        isSameLineInnerComment,
        isSameLineLeadingAndTrailingComment,
      ].some((predicate) => predicate(lastPrintableLeadingComment))
      ? ' '
      : '\n'
    : '';

  const lastPrintableInnerComment = last(printableInnerComments);
  const innerSeparator = lastPrintableInnerComment
    ? ['SameLineInnerComment'].includes(lastPrintableInnerComment.loc)
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

export function printNode<N extends LuaNode | LuaNodeGroup>(
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
      return createPrintProgram(printNode, _printComments)(node);
    case 'ExpressionStatement':
      return createPrintExpressionStatement(printNode)(node);
    case 'BlockStatement':
      return createPrintBlockStatement(printNode, _printComments)(node);
    case 'ReturnStatement':
      return createPrintReturnStatement(printNode)(node);
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
      return createPrintVariableDeclaration(printNode)(node);
    case 'NodeGroup':
      return createPrintNodeGroup(printNode)(node);
    case 'VariableDeclaratorIdentifier':
      return createPrintVariableDeclaratorIdentifier(printNode)(node);
    case 'VariableDeclaratorValue':
      return createPrintVariableDeclaratorValue(printNode)(node);
    case 'FunctionDeclaration':
      return `${node.isLocal ? 'local ' : ''}${printFunction(node)}`;
    case 'FunctionExpression':
      return printFunction(node);
    case 'TableConstructor':
      return createPrintTableConstructor(printNode)(node);
    case 'CallExpression':
      return printCallExpression(node);
    case 'TableNoKeyField':
      return createPrintTableNoKeyField(printNode)(node);
    case 'TableNameKeyField':
      return createPrintTableKeyField(printNode)(node);
    case 'TableExpressionKeyField':
      return createPrintTableExpressionKeyField(printNode)(node);
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
    case 'LuaTypeUnion':
      return createPrintTypeUnion(printNode)(node);
    case 'LuaTypeIntersection':
      return createPrintTypeIntersection(printNode)(node);
    case 'LuaTypeAliasDeclaration':
      return createPrintTypeAliasDeclaration(printNode)(node);
    case 'LuaTypeLiteral':
      return createPrintTypeLiteral(
        printNode,
        getPrintSections,
        _printComments
      )(node);
    case 'LuaTypeFunction':
      return createPrintTypeFunction(printNode)(node);
    case 'LuaFunctionReturnType':
      return createPrintFunctionReturnType(printNode)(node);
    case 'LuaTypeOfExpression':
      return createPrintTypeOfExpression(printNode)(node);
    case 'LuaFunctionTypeParam': {
      const typeAnnotationString = printNode(node.typeAnnotation);
      return node.name
        ? `${printNode(node.name)}:${typeAnnotationString}`
        : typeAnnotationString;
    }
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
      } ${useParenthesis(node.right, checkPrecedence(node, 0))}`;
    case 'LuaUnaryExpression':
      return `${node.operator}${useParenthesis(
        node.argument,
        anyPass([checkPrecedence(node), isUnaryExpression])
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
    case 'LuaBreakStatement':
      return createPrintBreakStatement()(node);
    case 'ContinueStatement':
      return createPrintContinueStatement()(node);
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
      return createPrintUnhandledStatement()(node);
    case 'UnhandledExpression':
      return `error("not implemented")`;
    case 'UnhandledTypeAnnotation':
      return ': any';
    default:
      return '--[[ default ]]';
  }
};

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

  const returnType = node.returnType ? `: ${printNode(node.returnType)}` : '';

  const body = printNode(node.body);

  const innerComments = '';
  _printComments(getPrintableInnerComments(node.innerComments));

  return `function${name}(${parameters})${returnType}${innerComments}${
    body ? `\n${body}\n` : ' '
  }end`;
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

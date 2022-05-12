import {
  blockStatement as babelBlockStatement,
  exportNamedDeclaration as babelExportNamedDeclaration,
  exportSpecifier as babelExportSpecifier,
  functionDeclaration as babelFunctionDeclaration,
  identifier as babelIdentifier,
  stringLiteral as babelStringLiteral,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import {
  forwardAsStatementHandlerRef,
  forwardHandlerFunctionRef,
  forwardHandlerRef,
  testUtils,
} from '@js-to-lua/handler-utils';

import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  functionDeclaration,
  identifier,
  indexExpression,
  memberExpression,
  nodeGroup,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createDeclarationHandler } from '../../declaration/declaration.handler';
import {
  expressionHandler,
  expressionAsStatementHandler,
  objectFieldHandler,
  handleObjectKeyExpression,
  handleObjectPropertyIdentifier,
  handleObjectPropertyValue,
  statementHandler,
} from '../../expression-statement.handler';
import {
  createIdentifierHandler,
  createIdentifierStrictHandler,
} from '../../expression/identifier.handler';
import { createLValHandler } from '../../l-val.handler';
import { createTypeAnnotationHandler } from '../../type/type-annotation.handler';
import { createExportNamedHandler } from './export-named.handler';

const { handleTypeAnnotation } = createTypeAnnotationHandler(
  forwardHandlerRef(() => expressionHandler),
  forwardHandlerRef(() => handleIdentifier)
);

const handleIdentifier = createIdentifierHandler(
  forwardHandlerFunctionRef(() => handleTypeAnnotation)
);

const handleIdentifierStrict = createIdentifierStrictHandler(
  forwardHandlerFunctionRef(() => handleTypeAnnotation)
);

const handleLVal = createLValHandler(
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => expressionHandler)
);

const handleDeclaration = createDeclarationHandler(
  forwardHandlerRef(() => expressionHandler),
  forwardAsStatementHandlerRef(() => expressionAsStatementHandler),
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleIdentifierStrict),
  forwardHandlerRef(() => statementHandler),
  forwardHandlerRef(() => objectFieldHandler),
  handleObjectPropertyIdentifier,
  handleObjectKeyExpression,
  handleObjectPropertyValue,
  forwardHandlerRef(() => handleLVal)
);

const { handler } = createExportNamedHandler(
  forwardHandlerRef(() => handleDeclaration),
  forwardHandlerRef(() => expressionHandler),
  testUtils.mockNodeWithValueHandler
);

const source = '';

describe('Export Named Handler', () => {
  it(`should export named variable declaration`, () => {
    const given = babelExportNamedDeclaration(
      babelVariableDeclaration('const', [
        babelVariableDeclarator(babelIdentifier('foo')),
      ])
    );

    const expected = nodeGroup([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        []
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('exports'), '.', identifier('foo'))],
        [identifier('foo')]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export named function declaration`, () => {
    const given = babelExportNamedDeclaration(
      babelFunctionDeclaration(
        babelIdentifier('foo'),
        [],
        babelBlockStatement([])
      )
    );

    const expected = nodeGroup([
      functionDeclaration(identifier('foo'), [], nodeGroup([])),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('exports'), '.', identifier('foo'))],
        [identifier('foo')]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export named list`, () => {
    const given = babelExportNamedDeclaration(undefined, [
      babelExportSpecifier(babelIdentifier('foo'), babelIdentifier('foo')),
      babelExportSpecifier(babelIdentifier('bar'), babelIdentifier('bar')),
    ]);

    const expected = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('exports'), '.', identifier('foo'))],
        [mockNodeWithValue(identifier('foo'))]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('exports'), '.', identifier('bar'))],
        [mockNodeWithValue(identifier('bar'))]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export named list with alias identifiers`, () => {
    const given = babelExportNamedDeclaration(undefined, [
      babelExportSpecifier(babelIdentifier('foo'), babelIdentifier('foo1')),
      babelExportSpecifier(babelIdentifier('bar'), babelIdentifier('bar1')),
    ]);

    const expected = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('exports'), '.', identifier('foo1'))],
        [mockNodeWithValue(identifier('foo'))]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('exports'), '.', identifier('bar1'))],
        [mockNodeWithValue(identifier('bar'))]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export named list with alias string literals`, () => {
    const given = babelExportNamedDeclaration(undefined, [
      babelExportSpecifier(babelIdentifier('foo'), babelStringLiteral('foo-1')),
      babelExportSpecifier(babelIdentifier('bar'), babelStringLiteral('bar-1')),
    ]);

    const expected = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [indexExpression(identifier('exports'), stringLiteral('foo-1'))],
        [mockNodeWithValue(identifier('foo'))]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [indexExpression(identifier('exports'), stringLiteral('bar-1'))],
        [mockNodeWithValue(identifier('bar'))]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });
});

import * as Babel from '@babel/types';
import {
  forwardAsStatementHandlerRef,
  forwardHandlerFunctionRef,
  forwardHandlerRef,
  testUtils,
} from '@js-to-lua/handler-utils';

import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  blockStatement,
  functionDeclaration,
  identifier,
  indexExpression,
  memberExpression,
  nodeGroup,
  stringLiteral,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createDeclarationHandler } from '../../declaration/declaration.handler';
import {
  expressionAsStatementHandler,
  expressionHandler,
  handleObjectKeyExpression,
  handleObjectPropertyIdentifier,
  handleObjectPropertyValue,
  objectFieldHandler,
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
    const given = Babel.exportNamedDeclaration(
      Babel.variableDeclaration('const', [
        Babel.variableDeclarator(Babel.identifier('foo')),
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
    const given = Babel.exportNamedDeclaration(
      Babel.functionDeclaration(
        Babel.identifier('foo'),
        [],
        Babel.blockStatement([])
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

  it(`should export namespace`, () => {
    const given = Babel.exportNamedDeclaration(
      Babel.tsModuleDeclaration(
        Babel.identifier('Foo'),
        Babel.tsModuleBlock([
          Babel.variableDeclaration('const', [
            Babel.variableDeclarator(
              Babel.identifier('foo'),
              Babel.identifier('bar')
            ),
          ]),
        ])
      )
    );

    const expected = nodeGroup([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Foo'))],
        [variableDeclaratorValue(tableConstructor())]
      ),
      blockStatement([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [variableDeclaratorValue(identifier('bar'))]
        ),
      ]),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('exports'), '.', identifier('Foo'))],
        [identifier('Foo')]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export named list`, () => {
    const given = Babel.exportNamedDeclaration(undefined, [
      Babel.exportSpecifier(Babel.identifier('foo'), Babel.identifier('foo')),
      Babel.exportSpecifier(Babel.identifier('bar'), Babel.identifier('bar')),
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
    const given = Babel.exportNamedDeclaration(undefined, [
      Babel.exportSpecifier(Babel.identifier('foo'), Babel.identifier('foo1')),
      Babel.exportSpecifier(Babel.identifier('bar'), Babel.identifier('bar1')),
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
    const given = Babel.exportNamedDeclaration(undefined, [
      Babel.exportSpecifier(
        Babel.identifier('foo'),
        Babel.stringLiteral('foo-1')
      ),
      Babel.exportSpecifier(
        Babel.identifier('bar'),
        Babel.stringLiteral('bar-1')
      ),
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

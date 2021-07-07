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
  assignmentStatement,
  functionDeclaration,
  identifier,
  indexExpression,
  memberExpression,
  nodeGroup,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { createExportNamedHandler } from './export-named.handler';
import { forwardHandlerRef } from '../../../utils/forward-handler-ref';
import {
  handleDeclaration,
  handleExpression,
} from '../../expression-statement.handler';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../../testUtils/mock-node';

const { handler } = createExportNamedHandler(
  forwardHandlerRef(() => handleDeclaration),
  forwardHandlerRef(() => handleExpression),
  mockNodeWithValueHandler
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
      functionDeclaration(identifier('foo'), [], []),
      assignmentStatement(
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
        [memberExpression(identifier('exports'), '.', identifier('foo'))],
        [mockNodeWithValue(identifier('foo'))]
      ),
      assignmentStatement(
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
        [memberExpression(identifier('exports'), '.', identifier('foo1'))],
        [mockNodeWithValue(identifier('foo'))]
      ),
      assignmentStatement(
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
        [indexExpression(identifier('exports'), stringLiteral('foo-1'))],
        [mockNodeWithValue(identifier('foo'))]
      ),
      assignmentStatement(
        [indexExpression(identifier('exports'), stringLiteral('bar-1'))],
        [mockNodeWithValue(identifier('bar'))]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });
});

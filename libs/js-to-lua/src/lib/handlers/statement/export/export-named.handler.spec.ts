import {
  blockStatement as babelBlockStatement,
  exportNamedDeclaration as babelExportNamedDeclaration,
  functionDeclaration as babelFunctionDeclaration,
  identifier as babelIdentifier,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import {
  assignmentStatement,
  functionDeclaration,
  identifier,
  memberExpression,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { createExportNamedHandler } from './export-named.handler';
import { forwardHandlerRef } from '../../../utils/forward-handler-ref';
import { handleDeclaration } from '../../expression-statement.handler';

const { handler } = createExportNamedHandler(
  forwardHandlerRef(() => handleDeclaration)
);

const source = '';

describe('Export Default Handler', () => {
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

    expect(handler(source, given)).toEqual(expected);
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

    expect(handler(source, given)).toEqual(expected);
  });
});

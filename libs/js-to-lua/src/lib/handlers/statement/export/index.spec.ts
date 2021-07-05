import {
  exportDefaultDeclaration as babelExportDefaultDeclaration,
  exportNamedDeclaration as babelExportNamedDeclaration,
  identifier as babelIdentifier,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import {
  assignmentStatement,
  identifier,
  memberExpression,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  withExtras,
} from '@js-to-lua/lua-types';
import { forwardHandlerRef } from '../../../utils/forward-handler-ref';
import {
  handleDeclaration,
  handleExpression,
} from '../../expression-statement.handler';
import { createExportHandler } from './index';

const { handler } = createExportHandler(
  forwardHandlerRef(() => handleDeclaration),
  forwardHandlerRef(() => handleExpression)
);

const source = '';

describe('Export Handler', () => {
  const withExportExtras = withExtras({ doesExport: true });

  it(`should add export named 'doesExport' extra to export named`, () => {
    const given = babelExportNamedDeclaration(
      babelVariableDeclaration('const', [
        babelVariableDeclarator(babelIdentifier('foo')),
      ])
    );

    const expected = withExportExtras(
      nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          []
        ),
        assignmentStatement(
          [memberExpression(identifier('exports'), '.', identifier('foo'))],
          [identifier('foo')]
        ),
      ])
    );

    expect(handler(source, given)).toEqual(expected);
  });

  it(`should add export named 'doesExport' extra to export default`, () => {
    const given = babelExportDefaultDeclaration(babelIdentifier('foo'));

    const expected = withExportExtras(
      assignmentStatement(
        [memberExpression(identifier('exports'), '.', identifier('default'))],
        [identifier('foo')]
      )
    );

    expect(handler(source, given)).toEqual(expected);
  });
});

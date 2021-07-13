import {
  exportDefaultDeclaration as babelExportDefaultDeclaration,
  exportNamedDeclaration as babelExportNamedDeclaration,
  identifier as babelIdentifier,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  memberExpression,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  withExtras,
} from '@js-to-lua/lua-types';
import {
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '../../../utils/forward-handler-ref';
import {
  handleExpression,
  handleObjectField,
  handleStatement,
} from '../../expression-statement.handler';
import { createExportHandler } from './index';
import { mockNodeWithValueHandler } from '../../../testUtils/mock-node';
import { createDeclarationHandler } from '../../declaration.handler';
import { createIdentifierHandler } from '../../identifier.handler';
import { createTypeAnnotationHandler } from '../../type-annotation.handler';

const { typesHandler, handleTsTypes } = createTypeAnnotationHandler(
  forwardHandlerRef(() => handleExpression)
);

const handleIdentifier = createIdentifierHandler(
  forwardHandlerFunctionRef(() => typesHandler)
);

const handleDeclaration = createDeclarationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleStatement),
  handleTsTypes,
  forwardHandlerRef(() => handleObjectField)
);

const { handler } = createExportHandler(
  forwardHandlerRef(() => handleDeclaration),
  forwardHandlerRef(() => handleExpression),
  mockNodeWithValueHandler
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
          AssignmentStatementOperatorEnum.EQ,
          [memberExpression(identifier('exports'), '.', identifier('foo'))],
          [identifier('foo')]
        ),
      ])
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should add export named 'doesExport' extra to export default`, () => {
    const given = babelExportDefaultDeclaration(babelIdentifier('foo'));

    const expected = withExportExtras(
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('exports'), '.', identifier('default'))],
        [identifier('foo')]
      )
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});

import {
  exportDefaultDeclaration as babelExportDefaultDeclaration,
  exportNamedDeclaration as babelExportNamedDeclaration,
  identifier as babelIdentifier,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import {
  forwardAsStatementHandlerRef,
  forwardHandlerFunctionRef,
  forwardHandlerRef,
  testUtils,
} from '@js-to-lua/handler-utils';

import { withExtras } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  memberExpression,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
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
import { createExportHandler } from './index';

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

const { handler } = createExportHandler(
  forwardHandlerRef(() => handleDeclaration),
  forwardHandlerRef(() => expressionHandler),
  testUtils.mockNodeWithValueHandler
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

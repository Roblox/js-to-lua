import {
  arrowFunctionExpression as babelArrowFunctionExpression,
  blockStatement as babelBlockStatement,
  callExpression as babelCallExpression,
  exportDefaultDeclaration as babelExportDefaultDeclaration,
  functionDeclaration as babelFunctionDeclaration,
  functionExpression as babelFunctionExpression,
  identifier as babelIdentifier,
  objectExpression as babelObjectExpression,
  objectProperty as babelObjectProperty,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '@js-to-lua/handler-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  functionDeclaration,
  functionExpression,
  identifier,
  memberExpression,
  nodeGroup,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
} from '@js-to-lua/lua-types';
import { createDeclarationHandler } from '../../declaration/declaration.handler';
import {
  handleExpression,
  handleExpressionAsStatement,
  handleObjectField,
  handleObjectKeyExpression,
  handleObjectPropertyIdentifier,
  handleObjectPropertyValue,
  handleStatement,
} from '../../expression-statement.handler';
import {
  createIdentifierHandler,
  createIdentifierStrictHandler,
} from '../../expression/identifier.handler';
import { createLValHandler } from '../../l-val.handler';
import { createTypeAnnotationHandler } from '../../type/type-annotation.handler';
import { createExportDefaultHandler } from './export-default.handler';

const { typesHandler, handleTypes } = createTypeAnnotationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleIdentifier)
);

const handleIdentifier = createIdentifierHandler(
  forwardHandlerFunctionRef(() => typesHandler)
);

const handleIdentifierStrict = createIdentifierStrictHandler(
  forwardHandlerFunctionRef(() => typesHandler)
);

const handleLVal = createLValHandler(
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleExpression)
);

const handleDeclaration = createDeclarationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleExpressionAsStatement),
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleIdentifierStrict),
  forwardHandlerRef(() => handleStatement),
  forwardHandlerRef(() => handleObjectField),
  handleTypes,
  forwardHandlerRef(() => handleObjectPropertyIdentifier),
  forwardHandlerRef(() => handleObjectKeyExpression),
  forwardHandlerRef(() => handleObjectPropertyValue),
  forwardHandlerRef(() => handleLVal)
);

const { handler } = createExportDefaultHandler(
  forwardHandlerRef(() => handleDeclaration),
  forwardHandlerRef(() => handleExpression)
);

const source = '';

describe('Export Default Handler', () => {
  it(`should export default identifier`, () => {
    const given = babelExportDefaultDeclaration(babelIdentifier('foo'));

    const expected = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [memberExpression(identifier('exports'), '.', identifier('default'))],
      [identifier('foo')]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export default ObjectExpression`, () => {
    const given = babelExportDefaultDeclaration(
      babelObjectExpression([
        babelObjectProperty(babelIdentifier('foo'), babelStringLiteral('bar')),
      ])
    );

    const expected = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [memberExpression(identifier('exports'), '.', identifier('default'))],
      [
        tableConstructor([
          tableNameKeyField(identifier('foo'), stringLiteral('bar')),
        ]),
      ]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export default function declaration`, () => {
    const given = babelExportDefaultDeclaration(
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
        [memberExpression(identifier('exports'), '.', identifier('default'))],
        [identifier('foo')]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export default function expression`, () => {
    const given = babelExportDefaultDeclaration(
      babelFunctionExpression(undefined, [], babelBlockStatement([]))
    );

    const expected = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [memberExpression(identifier('exports'), '.', identifier('default'))],
      [functionExpression([], nodeGroup([]))]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export default arrow function expression`, () => {
    const given = babelExportDefaultDeclaration(
      babelArrowFunctionExpression([], babelBlockStatement([]))
    );

    const expected = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [memberExpression(identifier('exports'), '.', identifier('default'))],
      [functionExpression([], nodeGroup([]))]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export default expression`, () => {
    const given = babelExportDefaultDeclaration(
      babelCallExpression(babelIdentifier('foo'), [])
    );

    const expected = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [memberExpression(identifier('exports'), '.', identifier('default'))],
      [callExpression(identifier('foo'), [])]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});

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
  forwardAsStatementHandlerRef,
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
import { createExportDefaultHandler } from './export-default.handler';

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

const { handler } = createExportDefaultHandler(
  forwardHandlerRef(() => handleDeclaration),
  forwardHandlerRef(() => expressionHandler)
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

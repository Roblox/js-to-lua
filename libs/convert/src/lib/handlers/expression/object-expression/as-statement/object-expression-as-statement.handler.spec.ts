import {
  blockStatement as babelBlockStatement,
  booleanLiteral as babelBooleanLiteral,
  functionExpression as babelFunctionExpression,
  identifier as babelIdentifier,
  nullLiteral as babelNullLiteral,
  numericLiteral as babelNumericLiteral,
  objectExpression as babelObjectExpression,
  objectMethod,
  objectProperty as babelObjectProperty,
  spreadElement as babelSpreadElement,
  stringLiteral as babelStringLiteral,
  updateExpression,
} from '@babel/types';
import { asStatementReturnTypeInline } from '@js-to-lua/handler-utils';
import { objectAssign, objectNone } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  callExpression,
  functionExpression,
  identifier,
  numericLiteral,
  stringLiteral,
  tableConstructor,
  tableExpressionKeyField,
  tableNameKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import {
  expressionHandler,
  objectFieldAsStatementHandler,
} from '../../../expression-statement.handler';
import { createObjectExpressionAsStatementHandler } from './object-expression-as-statement.handler';

const source = '';
const handleObjectExpressionAsStatement =
  createObjectExpressionAsStatementHandler(
    expressionHandler.handler,
    objectFieldAsStatementHandler.handler
  ).handler;

describe('Object Expression Handler', () => {
  describe('without side effects', () => {
    it(`should return Lua Table Constructor Node with empty elements`, () => {
      const given = babelObjectExpression([]);

      const expected = asStatementReturnTypeInline(
        [],
        tableConstructor([]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should return Lua Table Constructor Node with TableNameKeyField elements`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(babelIdentifier('foo'), babelBooleanLiteral(true)),
        babelObjectProperty(babelIdentifier('bar'), babelNumericLiteral(1)),
        babelObjectProperty(babelIdentifier('baz'), babelStringLiteral('abc')),
      ]);

      const expected = asStatementReturnTypeInline(
        [],
        tableConstructor([
          tableNameKeyField(identifier('foo'), booleanLiteral(true)),
          tableNameKeyField(identifier('bar'), numericLiteral(1)),
          tableNameKeyField(identifier('baz'), stringLiteral('abc')),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should return Lua Table Constructor Node with TableExpressionKeyField elements`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelStringLiteral('foo'),
          babelBooleanLiteral(true)
        ),
        babelObjectProperty(babelStringLiteral('bar'), babelNumericLiteral(1)),
        babelObjectProperty(
          babelStringLiteral('baz'),
          babelStringLiteral('abc')
        ),
      ]);

      const expected = asStatementReturnTypeInline(
        [],
        tableConstructor([
          tableExpressionKeyField(stringLiteral('foo'), booleanLiteral(true)),
          tableExpressionKeyField(stringLiteral('bar'), numericLiteral(1)),
          tableExpressionKeyField(stringLiteral('baz'), stringLiteral('abc')),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle object spread expression with undefined assigned to property`, () => {
      const given = babelObjectExpression([
        babelSpreadElement(babelIdentifier('foo')),
        babelObjectProperty(babelIdentifier('bar'), babelNumericLiteral(1)),
        babelObjectProperty(
          babelIdentifier('baz'),
          babelIdentifier('undefined')
        ),
      ]);

      const expected = asStatementReturnTypeInline(
        [],
        callExpression(objectAssign(), [
          tableConstructor(),
          identifier('foo'),
          tableConstructor([
            tableNameKeyField(identifier('bar'), numericLiteral(1)),
            tableNameKeyField(identifier('baz'), objectNone()),
          ]),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle object spread expression with null assigned to property`, () => {
      const given = babelObjectExpression([
        babelSpreadElement(babelIdentifier('foo')),
        babelObjectProperty(babelIdentifier('bar'), babelNumericLiteral(1)),
        babelObjectProperty(babelIdentifier('baz'), babelNullLiteral()),
      ]);

      const expected = asStatementReturnTypeInline(
        [],
        callExpression(objectAssign(), [
          tableConstructor(),
          identifier('foo'),
          tableConstructor([
            tableNameKeyField(identifier('bar'), numericLiteral(1)),
            tableNameKeyField(identifier('baz'), objectNone()),
          ]),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle object of objects`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelIdentifier('foo0'),
          babelObjectExpression([
            babelObjectProperty(
              babelIdentifier('foo1'),
              babelBooleanLiteral(true)
            ),
          ])
        ),
        babelObjectProperty(
          babelIdentifier('bar0'),
          babelObjectExpression([
            babelObjectProperty(
              babelIdentifier('bar1'),
              babelNumericLiteral(1)
            ),
          ])
        ),
        babelObjectProperty(
          babelIdentifier('baz0'),
          babelObjectExpression([
            babelObjectProperty(
              babelIdentifier('baz1'),
              babelStringLiteral('abc')
            ),
          ])
        ),
      ]);

      const expected = asStatementReturnTypeInline(
        [],
        tableConstructor([
          tableNameKeyField(
            identifier('foo0'),
            tableConstructor([
              tableNameKeyField(identifier('foo1'), booleanLiteral(true)),
            ])
          ),
          tableNameKeyField(
            identifier('bar0'),
            tableConstructor([
              tableNameKeyField(identifier('bar1'), numericLiteral(1)),
            ])
          ),
          tableNameKeyField(
            identifier('baz0'),
            tableConstructor([
              tableNameKeyField(identifier('baz1'), stringLiteral('abc')),
            ])
          ),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle object with function properties`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelIdentifier('sound'),
          babelStringLiteral('bla')
        ),
        babelObjectProperty(
          babelIdentifier('method1'),
          babelFunctionExpression(undefined, [], babelBlockStatement([]))
        ),
        babelObjectProperty(
          babelIdentifier('method2'),
          babelFunctionExpression(
            undefined,
            [babelIdentifier('name')],
            babelBlockStatement([])
          )
        ),
      ]);

      const expected = asStatementReturnTypeInline(
        [],
        tableConstructor([
          tableNameKeyField(identifier('sound'), stringLiteral('bla')),
          tableNameKeyField(
            identifier('method1'),
            functionExpression([identifier('self')])
          ),
          tableNameKeyField(
            identifier('method2'),
            functionExpression([identifier('self'), identifier('name')])
          ),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle object with methods`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelIdentifier('sound'),
          babelStringLiteral('bla')
        ),
        objectMethod(
          'method',
          babelIdentifier('method1'),
          [],
          babelBlockStatement([])
        ),
        babelObjectProperty(
          babelIdentifier('method2'),
          babelFunctionExpression(
            undefined,
            [babelIdentifier('name')],
            babelBlockStatement([])
          )
        ),
      ]);

      const expected = asStatementReturnTypeInline(
        [],
        tableConstructor([
          tableNameKeyField(identifier('sound'), stringLiteral('bla')),
          tableNameKeyField(
            identifier('method1'),
            functionExpression([identifier('self')])
          ),
          tableNameKeyField(
            identifier('method2'),
            functionExpression([identifier('self'), identifier('name')])
          ),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle object with methods with string literal as key`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelStringLiteral('sound'),
          babelStringLiteral('bla')
        ),
        objectMethod(
          'method',
          babelStringLiteral('method1'),
          [],
          babelBlockStatement([])
        ),
        objectMethod(
          'method',
          babelStringLiteral('method2'),
          [babelIdentifier('name')],
          babelBlockStatement([])
        ),
      ]);

      const expected = asStatementReturnTypeInline(
        [],
        tableConstructor([
          tableExpressionKeyField(stringLiteral('sound'), stringLiteral('bla')),
          tableExpressionKeyField(
            stringLiteral('method1'),
            functionExpression([identifier('self')])
          ),
          tableExpressionKeyField(
            stringLiteral('method2'),
            functionExpression([identifier('self'), identifier('name')])
          ),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle deeply nested objects`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelIdentifier('foo'),
          babelObjectExpression([
            babelObjectProperty(
              babelIdentifier('bar'),
              babelObjectExpression([
                babelObjectProperty(
                  babelIdentifier('baz'),
                  babelObjectExpression([])
                ),
              ])
            ),
          ])
        ),
      ]);

      const expected = asStatementReturnTypeInline(
        [],
        tableConstructor([
          tableNameKeyField(
            identifier('foo'),
            tableConstructor([
              tableNameKeyField(
                identifier('bar'),
                tableConstructor([
                  tableNameKeyField(identifier('baz'), tableConstructor([])),
                ])
              ),
            ])
          ),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });
  });

  describe('with side effects', () => {
    it(`should return Lua Table Constructor Node with one UpdateExpression (postfix) as value`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelIdentifier('foo'),
          updateExpression('++', babelIdentifier('a'))
        ),
        babelObjectProperty(babelIdentifier('bar'), babelNumericLiteral(1)),
        babelObjectProperty(babelIdentifier('baz'), babelStringLiteral('abc')),
      ]);

      const expected = asStatementReturnTypeInline(
        [],
        tableConstructor([
          tableNameKeyField(identifier('foo'), identifier('a')),
          tableNameKeyField(identifier('bar'), numericLiteral(1)),
          tableNameKeyField(identifier('baz'), stringLiteral('abc')),
        ]),
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('a')],
            [numericLiteral(1)]
          ),
        ]
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should return Lua Table Constructor Node with one UpdateExpression (prefix) as value`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelIdentifier('foo'),
          updateExpression('++', babelIdentifier('a'), true)
        ),
        babelObjectProperty(babelIdentifier('bar'), babelNumericLiteral(1)),
        babelObjectProperty(babelIdentifier('baz'), babelStringLiteral('abc')),
      ]);

      const expected = asStatementReturnTypeInline(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('a')],
            [numericLiteral(1)]
          ),
        ],
        tableConstructor([
          tableNameKeyField(identifier('foo'), identifier('a')),
          tableNameKeyField(identifier('bar'), numericLiteral(1)),
          tableNameKeyField(identifier('baz'), stringLiteral('abc')),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should return Lua Table Constructor Node with multiple UpdateExpressions (postfix) as values`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelIdentifier('foo'),
          updateExpression('++', babelIdentifier('a'))
        ),
        babelObjectProperty(
          babelIdentifier('bar'),
          updateExpression('++', babelIdentifier('b'))
        ),
        babelObjectProperty(
          babelIdentifier('baz'),
          updateExpression('++', babelIdentifier('c'))
        ),
      ]);

      const expected = asStatementReturnTypeInline(
        [
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('refProp0'))],
            [variableDeclaratorValue(identifier('a'))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('a')],
            [numericLiteral(1)]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('refProp1'))],
            [variableDeclaratorValue(identifier('b'))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('b')],
            [numericLiteral(1)]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('refProp2'))],
            [variableDeclaratorValue(identifier('c'))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('c')],
            [numericLiteral(1)]
          ),
        ],
        tableConstructor([
          tableNameKeyField(identifier('foo'), identifier('refProp0')),
          tableNameKeyField(identifier('bar'), identifier('refProp1')),
          tableNameKeyField(identifier('baz'), identifier('refProp2')),
        ]),
        []
      );

      expect(handleObjectExpressionAsStatement(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should return Lua Table Constructor Node with multiple UpdateExpressions (prefix) as values`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelIdentifier('foo'),
          updateExpression('++', babelIdentifier('a'), true)
        ),
        babelObjectProperty(
          babelIdentifier('bar'),
          updateExpression('++', babelIdentifier('b'), true)
        ),
        babelObjectProperty(
          babelIdentifier('baz'),
          updateExpression('++', babelIdentifier('c'), true)
        ),
      ]);

      const expected = asStatementReturnTypeInline(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('a')],
            [numericLiteral(1)]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('refProp0'))],
            [variableDeclaratorValue(identifier('a'))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('b')],
            [numericLiteral(1)]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('refProp1'))],
            [variableDeclaratorValue(identifier('b'))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('c')],
            [numericLiteral(1)]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('refProp2'))],
            [variableDeclaratorValue(identifier('c'))]
          ),
        ],
        tableConstructor([
          tableNameKeyField(identifier('foo'), identifier('refProp0')),
          tableNameKeyField(identifier('bar'), identifier('refProp1')),
          tableNameKeyField(identifier('baz'), identifier('refProp2')),
        ]),
        []
      );

      const actual = handleObjectExpressionAsStatement(source, {}, given);
      expect(JSON.stringify(actual, undefined, 2)).toEqual(
        JSON.stringify(expected, undefined, 2)
      );
    });

    it(`should return Lua Table Constructor Node with multiple UpdateExpressions (mixed) as values`, () => {
      const given = babelObjectExpression([
        babelObjectProperty(
          babelIdentifier('foo'),
          updateExpression('++', babelIdentifier('a'), true)
        ),
        babelObjectProperty(
          babelIdentifier('bar'),
          updateExpression('++', babelIdentifier('b'))
        ),
        babelObjectProperty(
          babelIdentifier('baz'),
          updateExpression('++', babelIdentifier('c'), true)
        ),
      ]);

      const expected = asStatementReturnTypeInline(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('a')],
            [numericLiteral(1)]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('refProp0'))],
            [variableDeclaratorValue(identifier('a'))]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('refProp1'))],
            [variableDeclaratorValue(identifier('b'))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('b')],
            [numericLiteral(1)]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('c')],
            [numericLiteral(1)]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('refProp2'))],
            [variableDeclaratorValue(identifier('c'))]
          ),
        ],
        tableConstructor([
          tableNameKeyField(identifier('foo'), identifier('refProp0')),
          tableNameKeyField(identifier('bar'), identifier('refProp1')),
          tableNameKeyField(identifier('baz'), identifier('refProp2')),
        ]),
        []
      );

      const actual = handleObjectExpressionAsStatement(source, {}, given);
      expect(JSON.stringify(actual, undefined, 2)).toEqual(
        JSON.stringify(expected, undefined, 2)
      );
    });
  });
});

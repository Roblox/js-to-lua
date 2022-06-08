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
} from '@babel/types';
import { objectAssign, objectNone } from '@js-to-lua/lua-conversion-utils';
import {
  booleanLiteral,
  callExpression,
  functionExpression,
  identifier,
  numericLiteral,
  stringLiteral,
  tableConstructor,
  tableExpressionKeyField,
  tableNameKeyField,
} from '@js-to-lua/lua-types';
import {
  expressionHandler,
  objectFieldHandler,
} from '../../expression-statement.handler';
import { createObjectExpressionHandler } from './object-expression.handler';

const source = '';
const handleObjectExpression = createObjectExpressionHandler(
  expressionHandler.handler,
  objectFieldHandler.handler
);

describe('Object Expression Handler', () => {
  it(`should return Lua Table Constructor Node with empty elements`, () => {
    const given = babelObjectExpression([]);

    const expected = tableConstructor([]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return Lua Table Constructor Node with TableNameKeyField elements`, () => {
    const given = babelObjectExpression([
      babelObjectProperty(babelIdentifier('foo'), babelBooleanLiteral(true)),
      babelObjectProperty(babelIdentifier('bar'), babelNumericLiteral(1)),
      babelObjectProperty(babelIdentifier('baz'), babelStringLiteral('abc')),
    ]);

    const expected = tableConstructor([
      tableNameKeyField(identifier('foo'), booleanLiteral(true)),
      tableNameKeyField(identifier('bar'), numericLiteral(1)),
      tableNameKeyField(identifier('baz'), stringLiteral('abc')),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return Lua Table Constructor Node with TableExpressionKeyField elements`, () => {
    const given = babelObjectExpression([
      babelObjectProperty(babelStringLiteral('foo'), babelBooleanLiteral(true)),
      babelObjectProperty(babelStringLiteral('bar'), babelNumericLiteral(1)),
      babelObjectProperty(babelStringLiteral('baz'), babelStringLiteral('abc')),
    ]);

    const expected = tableConstructor([
      tableExpressionKeyField(stringLiteral('foo'), booleanLiteral(true)),
      tableExpressionKeyField(stringLiteral('bar'), numericLiteral(1)),
      tableExpressionKeyField(stringLiteral('baz'), stringLiteral('abc')),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle object spread expression with undefined assigned to property`, () => {
    const given = babelObjectExpression([
      babelSpreadElement(babelIdentifier('foo')),
      babelObjectProperty(babelIdentifier('bar'), babelNumericLiteral(1)),
      babelObjectProperty(babelIdentifier('baz'), babelIdentifier('undefined')),
    ]);

    const expected = callExpression(objectAssign(), [
      tableConstructor(),
      identifier('foo'),
      tableConstructor([
        tableNameKeyField(identifier('bar'), numericLiteral(1)),
        tableNameKeyField(identifier('baz'), objectNone()),
      ]),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle object spread expression with null assigned to property`, () => {
    const given = babelObjectExpression([
      babelSpreadElement(babelIdentifier('foo')),
      babelObjectProperty(babelIdentifier('bar'), babelNumericLiteral(1)),
      babelObjectProperty(babelIdentifier('baz'), babelNullLiteral()),
    ]);

    const expected = callExpression(objectAssign(), [
      tableConstructor(),
      identifier('foo'),
      tableConstructor([
        tableNameKeyField(identifier('bar'), numericLiteral(1)),
        tableNameKeyField(identifier('baz'), objectNone()),
      ]),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
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
          babelObjectProperty(babelIdentifier('bar1'), babelNumericLiteral(1)),
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

    const expected = tableConstructor([
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
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle object with function properties`, () => {
    const given = babelObjectExpression([
      babelObjectProperty(babelIdentifier('sound'), babelStringLiteral('bla')),
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

    const expected = tableConstructor([
      tableNameKeyField(identifier('sound'), stringLiteral('bla')),
      tableNameKeyField(
        identifier('method1'),
        functionExpression([identifier('self')])
      ),
      tableNameKeyField(
        identifier('method2'),
        functionExpression([identifier('self'), identifier('name')])
      ),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle object with methods`, () => {
    const given = babelObjectExpression([
      babelObjectProperty(babelIdentifier('sound'), babelStringLiteral('bla')),
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

    const expected = tableConstructor([
      tableNameKeyField(identifier('sound'), stringLiteral('bla')),
      tableNameKeyField(
        identifier('method1'),
        functionExpression([identifier('self')])
      ),
      tableNameKeyField(
        identifier('method2'),
        functionExpression([identifier('self'), identifier('name')])
      ),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
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

    const expected = tableConstructor([
      tableExpressionKeyField(stringLiteral('sound'), stringLiteral('bla')),
      tableExpressionKeyField(
        stringLiteral('method1'),
        functionExpression([identifier('self')])
      ),
      tableExpressionKeyField(
        stringLiteral('method2'),
        functionExpression([identifier('self'), identifier('name')])
      ),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
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

    const expected = tableConstructor([
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
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
  });
});

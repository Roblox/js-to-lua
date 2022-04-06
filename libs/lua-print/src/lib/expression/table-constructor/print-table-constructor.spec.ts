import {
  booleanLiteral,
  functionExpression,
  identifier,
  LuaTableConstructor,
  numericLiteral,
  stringLiteral,
  tableConstructor,
  tableExpressionKeyField,
  tableNameKeyField,
  tableNoKeyField,
} from '@js-to-lua/lua-types';
import { createPrintTableConstructor } from './print-table-constructor';
import { printNode } from '../../print-node';

const printTableConstructor = createPrintTableConstructor(printNode);

describe('Print Table Constructor', () => {
  it(`should print Lua Table Constructor Node with empty elements`, () => {
    const given: LuaTableConstructor = tableConstructor([]);
    const expected = '{}';

    expect(printTableConstructor(given)).toEqual(expected);
  });

  it(`should print Lua Table Constructor Node with TableNoKeyField elements`, () => {
    const given: LuaTableConstructor = tableConstructor([
      tableNoKeyField(booleanLiteral(true)),
      tableNoKeyField(numericLiteral(1)),
      tableNoKeyField(stringLiteral('abc')),
      tableNoKeyField(identifier('foo')),
    ]);
    const expected = '{true, 1, "abc", foo}';

    expect(printTableConstructor(given)).toEqual(expected);
  });

  it(`should print Lua Table Constructor Node with TableNameKeyField elements`, () => {
    const given: LuaTableConstructor = tableConstructor([
      tableNameKeyField(identifier('foo'), booleanLiteral(true)),
      tableNameKeyField(identifier('bar'), numericLiteral(1)),
      tableNameKeyField(identifier('baz'), stringLiteral('abc')),
    ]);
    const expected = '{foo = true, bar = 1, baz = "abc"}';

    expect(printTableConstructor(given)).toEqual(expected);
  });

  it(`should print Lua Table Constructor Node with TableExpressionKeyField elements`, () => {
    const given: LuaTableConstructor = tableConstructor([
      tableExpressionKeyField(stringLiteral('foo'), booleanLiteral(true)),
      tableExpressionKeyField(stringLiteral('bar'), numericLiteral(1)),
      tableExpressionKeyField(stringLiteral('baz'), stringLiteral('abc')),
    ]);
    const expected = '{["foo"] = true, ["bar"] = 1, ["baz"] = "abc"}';

    expect(printTableConstructor(given)).toEqual(expected);
  });

  it(`should print Lua Table Constructor Node with Function expression`, () => {
    const given: LuaTableConstructor = tableConstructor([
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
    const expected =
      '{sound = "bla", method1 = function(self) end, method2 = function(self, name) end}';

    expect(printTableConstructor(given)).toEqual(expected);
  });

  it(`should print Lua Table Constructor of Lua Table Constructors`, () => {
    const given: LuaTableConstructor = tableConstructor([
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
    const expected =
      '{foo0 = {foo1 = true}, bar0 = {bar1 = 1}, baz0 = {baz1 = "abc"}}';

    expect(printTableConstructor(given)).toEqual(expected);
  });

  it(`should print deeply nested Lua Table Constructor`, () => {
    const given: LuaTableConstructor = tableConstructor([
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
    const expected = '{foo = {bar = {baz = {}}}}';

    expect(printTableConstructor(given)).toEqual(expected);
  });
});

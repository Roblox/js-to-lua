import { getProgramNode } from './program.spec.utils';
import {
  arrayConcat,
  arraySpread,
  booleanLiteral,
  callExpression,
  expressionStatement,
  identifier,
  LuaProgram,
  numericLiteral,
  program,
  stringLiteral,
  tableConstructor,
  tableNoKeyField,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('Array expression', () => {
    it('should return empty Lua Table Constructor', () => {
      const given = getProgramNode(`
        ([])
      `);
      const expected: LuaProgram = program([
        expressionStatement(tableConstructor([])),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should return Lua Table Constructor Node with TableNoKeyField elements', () => {
      const given = getProgramNode(`
        ([1, true, 'string'])
      `);
      const expected: LuaProgram = program([
        expressionStatement(
          tableConstructor([
            tableNoKeyField(numericLiteral(1, '1')),
            tableNoKeyField(booleanLiteral(true)),
            tableNoKeyField(stringLiteral('string')),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle array of arrays`, () => {
      const given = getProgramNode(`
        ([[], []])
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          tableConstructor([
            tableNoKeyField(tableConstructor()),
            tableNoKeyField(tableConstructor()),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle deeply nested arrays`, () => {
      const given = getProgramNode(`
        ([[[[]]]])
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          tableConstructor([
            tableNoKeyField(
              tableConstructor([
                tableNoKeyField(
                  tableConstructor([tableNoKeyField(tableConstructor())])
                ),
              ])
            ),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle spread arrays`, () => {
      const given = getProgramNode(`
        ([1, 2, ...[3,4]])
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          callExpression(arrayConcat(), [
            tableConstructor(),
            tableConstructor([
              tableNoKeyField(numericLiteral(1, '1')),
              tableNoKeyField(numericLiteral(2, '2')),
            ]),
            tableConstructor([
              tableNoKeyField(numericLiteral(3, '3')),
              tableNoKeyField(numericLiteral(4, '4')),
            ]),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });

  it(`should return Lua Table Constructor Node with spread identifiers`, () => {
    const given = getProgramNode(`
        ([
          ...[
            1, 2,
            ...fizz
          ],
          ...baz
        ])
      `);
    const expected: LuaProgram = program([
      expressionStatement(
        callExpression(arrayConcat(), [
          tableConstructor(),
          callExpression(arrayConcat(), [
            tableConstructor(),
            tableConstructor([
              tableNoKeyField(numericLiteral(1, '1')),
              tableNoKeyField(numericLiteral(2, '2')),
            ]),
            callExpression(arraySpread(), [identifier('fizz')]),
          ]),
          callExpression(arraySpread(), [identifier('baz')]),
        ])
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return Lua Table Constructor Node with spread strings`, () => {
    const given = getProgramNode(`
        ([
          ...[
            1, 2,
            ...'fizz'
          ],
          ...'baz'
        ])
      `);
    const expected: LuaProgram = program([
      expressionStatement(
        callExpression(arrayConcat(), [
          tableConstructor(),
          callExpression(arrayConcat(), [
            tableConstructor(),
            tableConstructor([
              tableNoKeyField(numericLiteral(1, '1')),
              tableNoKeyField(numericLiteral(2, '2')),
            ]),
            callExpression(arraySpread(), [stringLiteral('fizz')]),
          ]),
          callExpression(arraySpread(), [stringLiteral('baz')]),
        ])
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});

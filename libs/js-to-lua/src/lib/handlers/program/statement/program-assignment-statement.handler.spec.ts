import {
  assignmentStatement,
  callExpression,
  expressionStatement,
  identifier,
  indexExpression,
  LuaExpression,
  memberExpression,
  nodeGroup,
  program,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

const source = '';
describe('Program handler', () => {
  describe('Assignment Statement Handler', () => {
    it(`should handle simple AssignmentStatement `, () => {
      const given = getProgramNode(`
        foo = bar
      `);
      const expected = program([
        expressionStatement(
          (assignmentStatement(
            [identifier('foo')],
            [identifier('bar')]
          ) as unknown) as LuaExpression
        ),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it(`should handle chained AssignmentStatement `, () => {
      const given = getProgramNode(`
        foo = bar = baz
      `);
      const expected = program([
        expressionStatement(
          (nodeGroup([
            assignmentStatement([identifier('bar')], [identifier('baz')]),
            assignmentStatement([identifier('foo')], [identifier('bar')]),
          ]) as unknown) as LuaExpression
        ),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it(`should handle AssignmentStatement with member expression on the left`, () => {
      const given = getProgramNode(`
        foo.bar = baz
      `);
      const expected = program([
        expressionStatement(
          (assignmentStatement(
            [memberExpression(identifier('foo'), '.', identifier('bar'))],
            [identifier('baz')]
          ) as unknown) as LuaExpression
        ),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it(`should handle AssignmentStatement with index expression on the left`, () => {
      const given = getProgramNode(`
        foo[bar] = baz
        foo['bar'] = baz
      `);
      const expected = program([
        expressionStatement(
          (assignmentStatement(
            [
              indexExpression(
                identifier('foo'),
                callExpression(identifier('tostring'), [identifier('bar')])
              ),
            ],
            [identifier('baz')]
          ) as unknown) as LuaExpression
        ),
        expressionStatement(
          (assignmentStatement(
            [indexExpression(identifier('foo'), stringLiteral('bar'))],
            [identifier('baz')]
          ) as unknown) as LuaExpression
        ),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });
});

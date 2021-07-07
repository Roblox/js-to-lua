import {
  assignmentStatement,
  expressionStatement,
  identifier,
  LuaExpression,
  nodeGroup,
  program,
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
  });
});

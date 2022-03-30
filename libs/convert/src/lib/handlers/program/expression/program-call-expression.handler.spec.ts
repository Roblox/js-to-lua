import { tableUnpackCall } from '@js-to-lua/lua-conversion-utils';
import { getProgramNode } from '../program.spec.utils';
import {
  callExpression,
  expressionStatement,
  identifier,
  memberExpression,
  numericLiteral,
  program,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';

describe('Program handler', () => {
  describe('Call Expression Handler', () => {
    it('should handle function call expression:', () => {
      const source = `
        foo(1, 2)
      `;
      const given = getProgramNode(source);

      const expected = program([
        expressionStatement(
          callExpression(identifier('foo'), [
            numericLiteral(1, '1'),
            numericLiteral(2, '2'),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle function call expression using call', () => {
      const source = `
        foo.call(fooThis, 1, 2)
      `;
      const given = getProgramNode(source);

      const expected = program([
        expressionStatement(
          callExpression(identifier('foo'), [
            identifier('fooThis'),
            numericLiteral(1, '1'),
            numericLiteral(2, '2'),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle function call expression using apply with one param', () => {
      const source = `
        foo.apply(fooThis)
      `;
      const given = getProgramNode(source);

      const expected = program([
        expressionStatement(
          callExpression(identifier('foo'), [identifier('fooThis')])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle function call expression using apply with two params', () => {
      const source = `
        foo.apply(fooThis, fooArgs)
      `;
      const given = getProgramNode(source);

      const expected = program([
        expressionStatement(
          callExpression(identifier('foo'), [
            identifier('fooThis'),
            tableUnpackCall(identifier('fooArgs')),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle function call expression using apply with more than two params', () => {
      const source = `
        foo.apply(fooArg0, fooArg1, fooArg2)
      `;
      const given = getProgramNode(source);

      const expected = program([
        expressionStatement(
          callExpression(
            memberExpression(identifier('foo'), ':', identifier('apply')),
            [
              identifier('fooArg0'),
              identifier('fooArg1'),
              identifier('fooArg2'),
            ]
          )
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});

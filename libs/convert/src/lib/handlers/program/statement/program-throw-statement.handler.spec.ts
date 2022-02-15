import {
  callExpression,
  expressionStatement,
  identifier,
  program,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

const source = '';

describe('Throw Statement Handler', () => {
  it(`should handle ThrowStatement `, () => {
    const given = getProgramNode(`
        throw foo
      `);
    const expected = program([
      expressionStatement(
        callExpression(identifier('error'), [identifier('foo')])
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});

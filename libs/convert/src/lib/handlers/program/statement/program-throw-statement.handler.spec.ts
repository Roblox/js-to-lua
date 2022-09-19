import {
  callExpression,
  expressionStatement,
  identifier,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

const source = '';

describe('Throw Statement Handler', () => {
  it(`should handle ThrowStatement `, () => {
    const given = getProgramNode(`
        throw foo
      `);
    const expected = programWithUpstreamComment([
      expressionStatement(
        callExpression(identifier('error'), [identifier('foo')])
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});

import {
  callExpression,
  expressionStatement,
  identifier,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
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

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });
});

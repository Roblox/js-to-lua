import {
  callExpression,
  booleanMethod,
  elseClause,
  elseifClause,
  identifier,
  ifClause,
  ifStatement,
  program,
} from '@js-to-lua/lua-types';

import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

const source = '';

describe('If statement Handler', () => {
  it(`should handle if`, () => {
    const given = getProgramNode(`
        if(foo) {}
      `);

    const expected = program([
      ifStatement(
        ifClause(
          callExpression(booleanMethod('toJSBoolean'), [identifier('foo')]),
          []
        )
      ),
    ]);

    handleProgram.handler(source, {}, given);
    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/else`, () => {
    const given = getProgramNode(`
        if(foo) {} else {}
      `);

    const expected = program([
      ifStatement(
        ifClause(
          callExpression(booleanMethod('toJSBoolean'), [identifier('foo')]),
          []
        ),
        [],
        elseClause([])
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/elseif`, () => {
    const given = getProgramNode(`
        if(foo) {} else if (bar) {}
      `);

    const expected = program([
      ifStatement(
        ifClause(
          callExpression(booleanMethod('toJSBoolean'), [identifier('foo')]),
          []
        ),
        [
          elseifClause(
            callExpression(booleanMethod('toJSBoolean'), [identifier('bar')]),
            []
          ),
        ]
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/elseif/else`, () => {
    const given = getProgramNode(`
        if(foo) {} else if (bar) {} else {}
      `);

    const expected = program([
      ifStatement(
        ifClause(
          callExpression(booleanMethod('toJSBoolean'), [identifier('foo')]),
          []
        ),
        [
          elseifClause(
            callExpression(booleanMethod('toJSBoolean'), [identifier('bar')]),
            []
          ),
        ],
        elseClause([])
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});

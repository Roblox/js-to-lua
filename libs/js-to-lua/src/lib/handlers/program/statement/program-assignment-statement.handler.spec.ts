import {
  assignmentStatement,
  callExpression,
  expressionStatement,
  identifier,
  indexExpression,
  LuaExpression,
  memberExpression,
  nodeGroup,
  numericLiteral,
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

  it(`should handle array destructuring`, () => {
    const given = getProgramNode(`
        ([foo, bar] = baz);
      `);

    const expected = program([
      expressionStatement(
        (nodeGroup([
          assignmentStatement(
            [identifier('foo'), identifier('bar')],
            [
              callExpression(identifier('table.unpack'), [
                identifier('baz'),
                numericLiteral(1),
                numericLiteral(2),
              ]),
            ]
          ),
        ]) as unknown) as LuaExpression
      ),
    ]);

    const actual = handleProgram.handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it(`should handle array destructuring with nested arrays`, () => {
    const given = getProgramNode(`
        ([foo, [bar, baz]] = fizz);
      `);

    const expected = program([
      expressionStatement(
        (nodeGroup([
          assignmentStatement(
            [identifier('foo')],
            [
              callExpression(identifier('table.unpack'), [
                identifier('fizz'),
                numericLiteral(1),
                numericLiteral(1),
              ]),
            ]
          ),
          assignmentStatement(
            [identifier('bar'), identifier('baz')],
            [
              callExpression(identifier('table.unpack'), [
                callExpression(identifier('table.unpack'), [
                  identifier('fizz'),
                  numericLiteral(2),
                  numericLiteral(2),
                ]),
                numericLiteral(1),
                numericLiteral(2),
              ]),
            ]
          ),
        ]) as unknown) as LuaExpression
      ),
    ]);

    const actual = handleProgram.handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it(`should handle array destructuring with rest element`, () => {
    const given = getProgramNode(`
    ([foo, ...bar] = baz);
  `);

    const expected = program([
      expressionStatement(
        (nodeGroup([
          assignmentStatement(
            [identifier('foo')],
            [
              callExpression(identifier('table.unpack'), [
                identifier('baz'),
                numericLiteral(1),
                numericLiteral(1),
              ]),
            ]
          ),
          assignmentStatement(
            [identifier('bar')],
            [
              callExpression(identifier('table.pack'), [
                callExpression(identifier('table.unpack'), [
                  identifier('baz'),
                  numericLiteral(2),
                ]),
              ]),
            ]
          ),
        ]) as unknown) as LuaExpression
      ),
    ]);

    const actual = handleProgram.handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it(`should handle object destructuring`, () => {
    const given = getProgramNode(`
    ({foo, bar} = baz);
  `);

    const expected = program([
      expressionStatement(
        (assignmentStatement(
          [identifier('foo'), identifier('bar')],
          [
            memberExpression(identifier('baz'), '.', identifier('foo')),
            memberExpression(identifier('baz'), '.', identifier('bar')),
          ]
        ) as unknown) as LuaExpression
      ),
    ]);

    const actual = handleProgram.handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it(`should handle object destructuring with aliases`, () => {
    const given = getProgramNode(`
    ({foo:fun, bar:bat} = baz);
  `);

    const expected = program([
      expressionStatement(
        (assignmentStatement(
          [identifier('fun'), identifier('bat')],
          [
            memberExpression(identifier('baz'), '.', identifier('foo')),
            memberExpression(identifier('baz'), '.', identifier('bar')),
          ]
        ) as unknown) as LuaExpression
      ),
    ]);

    const actual = handleProgram.handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it(`should handle object destructuring with nested object pattern`, () => {
    const given = getProgramNode(`
    ({foo:{bar, baz}} = fizz);
  `);

    const expected = program([
      expressionStatement(
        (assignmentStatement(
          [identifier('bar'), identifier('baz')],
          [
            memberExpression(
              memberExpression(identifier('fizz'), '.', identifier('foo')),
              '.',
              identifier('bar')
            ),
            memberExpression(
              memberExpression(identifier('fizz'), '.', identifier('foo')),
              '.',
              identifier('baz')
            ),
          ]
        ) as unknown) as LuaExpression
      ),
    ]);

    const actual = handleProgram.handler(source, {}, given);
    expect(actual).toEqual(expected);
  });
});

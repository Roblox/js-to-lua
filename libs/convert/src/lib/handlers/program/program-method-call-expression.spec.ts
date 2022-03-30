import {
  tableUnpackCall,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  expressionStatement,
  identifier,
  indexExpression,
  memberExpression,
  program,
  stringLiteral,
  tableConstructor,
  tableNoKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Call Expression Handler', () => {
  it(`should handle computed member expressions`, () => {
    const given = getProgramNode(`
      foo['bar']()
      foo['bar']('baz')
      foo.bar['baz']()
    `);

    const expected = program([
      expressionStatement(
        callExpression(
          indexExpression(identifier('foo'), stringLiteral('bar')),
          [identifier('foo')]
        )
      ),
      expressionStatement(
        callExpression(
          indexExpression(identifier('foo'), stringLiteral('bar')),
          [identifier('foo'), stringLiteral('baz')]
        )
      ),
      expressionStatement(
        callExpression(
          indexExpression(
            memberExpression(identifier('foo'), '.', identifier('bar')),
            stringLiteral('baz')
          ),
          [memberExpression(identifier('foo'), '.', identifier('bar'))]
        )
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle not computed member expressions`, () => {
    const given = getProgramNode(`
      foo.bar()
      foo.bar('baz')
      foo.bar.baz()
      `);

    const expected = program([
      expressionStatement(
        callExpression(
          memberExpression(identifier('foo'), ':', identifier('bar')),
          []
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(identifier('foo'), ':', identifier('bar')),
          [stringLiteral('baz')]
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(
            memberExpression(identifier('foo'), '.', identifier('bar')),
            ':',
            identifier('baz')
          ),
          []
        )
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle deeply nested method call`, () => {
    const given = getProgramNode(`
          expect_(foo).never.to.be.empty()
        `);

    const expected = program([
      expressionStatement(
        callExpression(
          memberExpression(
            memberExpression(
              memberExpression(
                memberExpression(
                  callExpression(identifier('expect_'), [identifier('foo')]),
                  '.',
                  identifier('never')
                ),
                '.',
                identifier('to')
              ),
              '.',
              identifier('be')
            ),
            ':',
            identifier('empty')
          ),
          []
        )
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle computed member expressions with spread element`, () => {
    const given = getProgramNode(`
      foo['bar'](...baz)
      foo['bar']('baz', ...fizz)
      foo['bar'](...fizz, 'baz')
    `);

    const expected = program([
      withTrailingConversionComment(
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Packages'))],
          []
        ),
        'ROBLOX comment: must define Packages module'
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
        [
          variableDeclaratorValue(
            callExpression(identifier('require'), [
              memberExpression(
                identifier('Packages'),
                '.',
                identifier('LuauPolyfill')
              ),
            ])
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Array'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Array')
            )
          ),
        ]
      ),
      expressionStatement(
        callExpression(
          indexExpression(identifier('foo'), stringLiteral('bar')),
          [
            identifier('foo'),
            tableUnpackCall(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('spread')
                ),
                [identifier('baz')]
              )
            ),
          ]
        )
      ),
      expressionStatement(
        callExpression(
          indexExpression(identifier('foo'), stringLiteral('bar')),
          [
            identifier('foo'),
            stringLiteral('baz'),
            tableUnpackCall(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('spread')
                ),
                [identifier('fizz')]
              )
            ),
          ]
        )
      ),
      expressionStatement(
        callExpression(
          indexExpression(identifier('foo'), stringLiteral('bar')),
          [
            identifier('foo'),
            tableUnpackCall(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('concat')
                ),
                [
                  tableConstructor(),
                  callExpression(
                    memberExpression(
                      identifier('Array'),
                      '.',
                      identifier('spread')
                    ),
                    [identifier('fizz')]
                  ),
                  tableConstructor([tableNoKeyField(stringLiteral('baz'))]),
                ]
              )
            ),
          ]
        )
      ),
    ]);

    expect(
      JSON.stringify(handleProgram.handler(source, {}, given), undefined, 2)
    ).toEqual(JSON.stringify(expected, undefined, 2));
  });

  it(`should handle not computed member expressions with spread element`, () => {
    const given = getProgramNode(`
      foo.bar(...baz)
      foo.bar('baz', ...fizz)
      foo.bar(...fizz, 'baz')
    `);

    const expected = program([
      withTrailingConversionComment(
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Packages'))],
          []
        ),
        'ROBLOX comment: must define Packages module'
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
        [
          variableDeclaratorValue(
            callExpression(identifier('require'), [
              memberExpression(
                identifier('Packages'),
                '.',
                identifier('LuauPolyfill')
              ),
            ])
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Array'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Array')
            )
          ),
        ]
      ),
      expressionStatement(
        callExpression(
          memberExpression(identifier('foo'), ':', identifier('bar')),
          [
            tableUnpackCall(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('spread')
                ),
                [identifier('baz')]
              )
            ),
          ]
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(identifier('foo'), ':', identifier('bar')),
          [
            stringLiteral('baz'),
            tableUnpackCall(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('spread')
                ),
                [identifier('fizz')]
              )
            ),
          ]
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(identifier('foo'), ':', identifier('bar')),
          [
            tableUnpackCall(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('concat')
                ),
                [
                  tableConstructor(),
                  callExpression(
                    memberExpression(
                      identifier('Array'),
                      '.',
                      identifier('spread')
                    ),
                    [identifier('fizz')]
                  ),
                  tableConstructor([tableNoKeyField(stringLiteral('baz'))]),
                ]
              )
            ),
          ]
        )
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  describe('Special cases', () => {
    it(`should handle toString() method`, () => {
      const given = getProgramNode(`
        foo.toString()
        foo['toString']()
        foo.toString('baz')
        foo['toString']('baz')
      `);

      const expected = program([
        expressionStatement(
          callExpression(identifier('tostring'), [identifier('foo')])
        ),
        expressionStatement(
          callExpression(identifier('tostring'), [identifier('foo')])
        ),

        expressionStatement(
          callExpression(
            memberExpression(identifier('foo'), ':', identifier('toString')),
            [stringLiteral('baz')]
          )
        ),
        expressionStatement(
          callExpression(
            indexExpression(identifier('foo'), stringLiteral('toString')),
            [identifier('foo'), stringLiteral('baz')]
          )
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle React object`, () => {
      const given = getProgramNode(`
      React.createElement("div")
      React['createElement']("div")
      React.foo()
      React['foo']()
      `);

      const expected = program([
        expressionStatement(
          callExpression(
            memberExpression(
              identifier('React'),
              '.',
              identifier('createElement')
            ),
            [stringLiteral('div')]
          )
        ),
        expressionStatement(
          callExpression(
            indexExpression(
              identifier('React'),
              stringLiteral('createElement')
            ),
            [stringLiteral('div')]
          )
        ),
        expressionStatement(
          callExpression(
            memberExpression(identifier('React'), '.', identifier('foo')),
            []
          )
        ),
        expressionStatement(
          callExpression(
            indexExpression(identifier('React'), stringLiteral('foo')),
            []
          )
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    describe('should handle Jest expect calls', () => {
      it(`direct method call`, () => {
        const given = getProgramNode(`
          expect(foo).toEqual(bar)
        `);

        const expected = program([
          expressionStatement(
            callExpression(
              memberExpression(
                callExpression(identifier('expect'), [identifier('foo')]),
                '.',
                identifier('toEqual')
              ),
              [identifier('bar')]
            )
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it(`nested method call`, () => {
        const given = getProgramNode(`
          expect(foo).never.toEqual(bar)
        `);

        const expected = program([
          expressionStatement(
            callExpression(
              memberExpression(
                memberExpression(
                  callExpression(identifier('expect'), [identifier('foo')]),
                  '.',
                  identifier('never')
                ),
                '.',
                identifier('toEqual')
              ),
              [identifier('bar')]
            )
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it(`deeply nested method call`, () => {
        const given = getProgramNode(`
          expect(foo).never.to.be.empty()
        `);

        const expected = program([
          expressionStatement(
            callExpression(
              memberExpression(
                memberExpression(
                  memberExpression(
                    memberExpression(
                      callExpression(identifier('expect'), [identifier('foo')]),
                      '.',
                      identifier('never')
                    ),
                    '.',
                    identifier('to')
                  ),
                  '.',
                  identifier('be')
                ),
                '.',
                identifier('empty')
              ),
              []
            )
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });
  });
});

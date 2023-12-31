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
  stringLiteral,
  tableConstructor,
  tableNoKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from './program.spec.utils';

const source = '';

describe('Call Expression Handler', () => {
  it(`should handle computed member expressions`, () => {
    const given = getProgramNode(`
      foo['bar']()
      foo['bar']('baz')
      foo.bar['baz']()
    `);

    const expected = programWithUpstreamComment([
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

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle not computed member expressions`, () => {
    const given = getProgramNode(`
      foo.bar()
      foo.bar('baz')
      foo.bar.baz()
      `);

    const expected = programWithUpstreamComment([
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

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle deeply nested method call`, () => {
    const given = getProgramNode(`
          expect_(foo).never.to.be.empty()
        `);

    const expected = programWithUpstreamComment([
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

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle computed member expressions with spread element`, () => {
    const given = getProgramNode(`
      foo['bar'](...baz)
      foo['bar']('baz', ...fizz)
      foo['bar'](...fizz, 'baz')
    `);

    const expected = programWithUpstreamComment([
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

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle not computed member expressions with spread element`, () => {
    const given = getProgramNode(`
      foo.bar(...baz)
      foo.bar('baz', ...fizz)
      foo.bar(...fizz, 'baz')
    `);

    const expected = programWithUpstreamComment([
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

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  describe('Special cases', () => {
    it(`should handle toString() method`, () => {
      const given = getProgramNode(`
        foo.toString()
        foo['toString']()
        foo.toString('baz')
        foo['toString']('baz')
      `);

      const expected = programWithUpstreamComment([
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

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle React object`, () => {
      const given = getProgramNode(`
      React.createElement("div")
      React['createElement']("div")
      React.foo()
      React['foo']()
      `);

      const expected = programWithUpstreamComment([
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

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle ReactIs object`, () => {
      const given = getProgramNode(`
        ReactIs.isValidElementType(something)
        ReactIs['isValidElementType'](something)
        ReactIs.foo()
        ReactIs['foo']()
      `);

      const expected = programWithUpstreamComment([
        expressionStatement(
          callExpression(
            memberExpression(
              identifier('ReactIs'),
              '.',
              identifier('isValidElementType')
            ),
            [identifier('something')]
          )
        ),
        expressionStatement(
          callExpression(
            indexExpression(
              identifier('ReactIs'),
              stringLiteral('isValidElementType')
            ),
            [identifier('something')]
          )
        ),
        expressionStatement(
          callExpression(
            memberExpression(identifier('ReactIs'), '.', identifier('foo')),
            []
          )
        ),
        expressionStatement(
          callExpression(
            indexExpression(identifier('ReactIs'), stringLiteral('foo')),
            []
          )
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle ReactTestRenderer object`, () => {
      const given = getProgramNode(`
        ReactTestRenderer.create(something)
        ReactTestRenderer['create'](something)
        ReactTestRenderer.foo()
        ReactTestRenderer['foo']()
      `);

      const expected = programWithUpstreamComment([
        expressionStatement(
          callExpression(
            memberExpression(
              identifier('ReactTestRenderer'),
              '.',
              identifier('create')
            ),
            [identifier('something')]
          )
        ),
        expressionStatement(
          callExpression(
            indexExpression(
              identifier('ReactTestRenderer'),
              stringLiteral('create')
            ),
            [identifier('something')]
          )
        ),
        expressionStatement(
          callExpression(
            memberExpression(
              identifier('ReactTestRenderer'),
              '.',
              identifier('foo')
            ),
            []
          )
        ),
        expressionStatement(
          callExpression(
            indexExpression(
              identifier('ReactTestRenderer'),
              stringLiteral('foo')
            ),
            []
          )
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    describe('should handle Jest expect calls', () => {
      it(`direct method call`, () => {
        const given = getProgramNode(`
          expect(foo).toEqual(bar)
        `);

        const expected = programWithUpstreamComment([
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

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });

      it(`nested method call`, () => {
        const given = getProgramNode(`
          expect(foo).never.toEqual(bar)
        `);

        const expected = programWithUpstreamComment([
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

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });

      it(`deeply nested method call`, () => {
        const given = getProgramNode(`
          expect(foo).never.to.be.empty()
        `);

        const expected = programWithUpstreamComment([
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

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });
    });
  });
});

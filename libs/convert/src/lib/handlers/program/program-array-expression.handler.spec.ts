import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  booleanLiteral,
  callExpression,
  identifier,
  LuaProgram,
  memberExpression,
  numericLiteral,
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

describe('Program handler', () => {
  describe('Array expression', () => {
    it('should return empty Lua Table Constructor', () => {
      const given = getProgramNode(`
        const foo = []
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [variableDeclaratorValue(tableConstructor([]))]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should return Lua Table Constructor Node with TableNoKeyField elements', () => {
      const given = getProgramNode(`
        const foo = [1, true, 'string']
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              tableConstructor([
                tableNoKeyField(numericLiteral(1, '1')),
                tableNoKeyField(booleanLiteral(true)),
                tableNoKeyField(stringLiteral('string')),
              ])
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle array of arrays`, () => {
      const given = getProgramNode(`
        const foo = [[], []]
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              tableConstructor([
                tableNoKeyField(tableConstructor()),
                tableNoKeyField(tableConstructor()),
              ])
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle deeply nested arrays`, () => {
      const given = getProgramNode(`
        const foo =[[[[]]]]
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              tableConstructor([
                tableNoKeyField(
                  tableConstructor([
                    tableNoKeyField(
                      tableConstructor([tableNoKeyField(tableConstructor())])
                    ),
                  ])
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle spread arrays`, () => {
      const given = getProgramNode(`
        const foo = [1, 2, ...[3,4]]
      `);

      const expected: LuaProgram = programWithUpstreamComment([
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
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('concat')
                ),
                [
                  tableConstructor(),
                  tableConstructor([
                    tableNoKeyField(numericLiteral(1, '1')),
                    tableNoKeyField(numericLiteral(2, '2')),
                  ]),
                  tableConstructor([
                    tableNoKeyField(numericLiteral(3, '3')),
                    tableNoKeyField(numericLiteral(4, '4')),
                  ]),
                ]
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });

  it(`should return Lua Table Constructor Node with spread identifiers`, () => {
    const given = getProgramNode(`
        const foo = [
          ...[
            1, 2,
            ...fizz
          ],
          ...baz
        ]
      `);
    const expected: LuaProgram = programWithUpstreamComment([
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
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [
          variableDeclaratorValue(
            callExpression(
              memberExpression(identifier('Array'), '.', identifier('concat')),
              [
                tableConstructor(),
                callExpression(
                  memberExpression(
                    identifier('Array'),
                    '.',
                    identifier('concat')
                  ),
                  [
                    tableConstructor(),
                    tableConstructor([
                      tableNoKeyField(numericLiteral(1, '1')),
                      tableNoKeyField(numericLiteral(2, '2')),
                    ]),
                    callExpression(
                      memberExpression(
                        identifier('Array'),
                        '.',
                        identifier('spread')
                      ),
                      [identifier('fizz')]
                    ),
                  ]
                ),
                callExpression(
                  memberExpression(
                    identifier('Array'),
                    '.',
                    identifier('spread')
                  ),
                  [identifier('baz')]
                ),
              ]
            )
          ),
        ]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should return Lua Table Constructor Node with spread strings`, () => {
    const given = getProgramNode(`
        const foo = [
          ...[
            1, 2,
            ...'fizz'
          ],
          ...'baz'
        ]
      `);
    const expected: LuaProgram = programWithUpstreamComment([
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
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [
          variableDeclaratorValue(
            callExpression(
              memberExpression(identifier('Array'), '.', identifier('concat')),
              [
                tableConstructor(),
                callExpression(
                  memberExpression(
                    identifier('Array'),
                    '.',
                    identifier('concat')
                  ),
                  [
                    tableConstructor(),
                    tableConstructor([
                      tableNoKeyField(numericLiteral(1, '1')),
                      tableNoKeyField(numericLiteral(2, '2')),
                    ]),
                    callExpression(
                      memberExpression(
                        identifier('Array'),
                        '.',
                        identifier('spread')
                      ),
                      [stringLiteral('fizz')]
                    ),
                  ]
                ),
                callExpression(
                  memberExpression(
                    identifier('Array'),
                    '.',
                    identifier('spread')
                  ),
                  [stringLiteral('baz')]
                ),
              ]
            )
          ),
        ]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });
});

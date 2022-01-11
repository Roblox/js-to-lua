import {
  booleanLiteral,
  callExpression,
  expressionStatement,
  identifier,
  LuaProgram,
  memberExpression,
  numericLiteral,
  program,
  stringLiteral,
  tableConstructor,
  tableNoKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Array expression', () => {
    it('should return empty Lua Table Constructor', () => {
      const given = getProgramNode(`
        ([])
      `);
      const expected: LuaProgram = program([
        expressionStatement(tableConstructor([])),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should return Lua Table Constructor Node with TableNoKeyField elements', () => {
      const given = getProgramNode(`
        ([1, true, 'string'])
      `);
      const expected: LuaProgram = program([
        expressionStatement(
          tableConstructor([
            tableNoKeyField(numericLiteral(1, '1')),
            tableNoKeyField(booleanLiteral(true)),
            tableNoKeyField(stringLiteral('string')),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle array of arrays`, () => {
      const given = getProgramNode(`
        ([[], []])
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          tableConstructor([
            tableNoKeyField(tableConstructor()),
            tableNoKeyField(tableConstructor()),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle deeply nested arrays`, () => {
      const given = getProgramNode(`
        ([[[[]]]])
      `);

      const expected: LuaProgram = program([
        expressionStatement(
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
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle spread arrays`, () => {
      const given = getProgramNode(`
        ([1, 2, ...[3,4]])
      `);

      const expected: LuaProgram = program([
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
            memberExpression(identifier('Array'), '.', identifier('concat')),
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
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });

  it(`should return Lua Table Constructor Node with spread identifiers`, () => {
    const given = getProgramNode(`
        ([
          ...[
            1, 2,
            ...fizz
          ],
          ...baz
        ])
      `);
    const expected: LuaProgram = program([
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
          memberExpression(identifier('Array'), '.', identifier('concat')),
          [
            tableConstructor(),
            callExpression(
              memberExpression(identifier('Array'), '.', identifier('concat')),
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
              memberExpression(identifier('Array'), '.', identifier('spread')),
              [identifier('baz')]
            ),
          ]
        )
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return Lua Table Constructor Node with spread strings`, () => {
    const given = getProgramNode(`
        ([
          ...[
            1, 2,
            ...'fizz'
          ],
          ...'baz'
        ])
      `);
    const expected: LuaProgram = program([
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
          memberExpression(identifier('Array'), '.', identifier('concat')),
          [
            tableConstructor(),
            callExpression(
              memberExpression(identifier('Array'), '.', identifier('concat')),
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
              memberExpression(identifier('Array'), '.', identifier('spread')),
              [stringLiteral('baz')]
            ),
          ]
        )
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});

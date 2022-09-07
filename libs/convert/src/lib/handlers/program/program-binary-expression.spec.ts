import {
  bit32Identifier,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  booleanLiteral,
  callExpression,
  identifier,
  memberExpression,
  multilineStringLiteral,
  numericLiteral,
  program,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Binary expression', () => {
    it('should handle arithmetic exponential operator', () => {
      const given = getProgramNode(`
        fizz = foo ** bar;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [binaryExpression(identifier('foo'), '^', identifier('bar'))]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic subtract operator', () => {
      const given = getProgramNode(`
        fizz = foo - bar;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [binaryExpression(identifier('foo'), '-', identifier('bar'))]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic multiplication operator', () => {
      const given = getProgramNode(`
        fizz = foo * bar;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [binaryExpression(identifier('foo'), '*', identifier('bar'))]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic division operator', () => {
      const given = getProgramNode(`
        fizz = foo / bar;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [binaryExpression(identifier('foo'), '/', identifier('bar'))]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic remainder operator', () => {
      const given = getProgramNode(`
        fizz = foo % bar;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [binaryExpression(identifier('foo'), '%', identifier('bar'))]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic add operator', () => {
      const given = getProgramNode(`
        fizz = foo + bar;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [binaryExpression(identifier('foo'), '+', identifier('bar'))]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic add operator with string literals', () => {
      const given = getProgramNode(`
        fizz = 'foo' + 'bar';
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [binaryExpression(stringLiteral('foo'), '..', stringLiteral('bar'))]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic add operator with multiple string literals', () => {
      const given = getProgramNode(`
        fizz = 'foo' + 'bar' + 'fizz' + 'buzz';
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            binaryExpression(
              binaryExpression(
                binaryExpression(
                  stringLiteral('foo'),
                  '..',
                  stringLiteral('bar')
                ),
                '..',
                stringLiteral('fizz')
              ),
              '..',
              stringLiteral('buzz')
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic add operator with one string literal', () => {
      const given = getProgramNode(`
        fizz = "foo" + bar
        fizz = foo + "bar"
        fizz = "foo" + 5
        fizz = "foo"+ true
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            binaryExpression(
              stringLiteral('foo'),
              '..',
              callExpression(identifier('tostring'), [identifier('bar')])
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            binaryExpression(
              callExpression(identifier('tostring'), [identifier('foo')]),
              '..',
              stringLiteral('bar')
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            binaryExpression(
              stringLiteral('foo'),
              '..',
              callExpression(identifier('tostring'), [numericLiteral(5, '5')])
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            binaryExpression(
              stringLiteral('foo'),
              '..',
              callExpression(identifier('tostring'), [booleanLiteral(true)])
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it(`should handle add operator with multiple template literals`, () => {
      const given = getProgramNode(`
        fizz = \`a string\` +
        \`a multiline
string\` +
        \`with expression \${foo}\`

    `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            binaryExpression(
              binaryExpression(
                stringLiteral('a string'),
                '..',
                multilineStringLiteral('a multiline\nstring')
              ),
              '..',
              callExpression(
                memberExpression(
                  stringLiteral('with expression %s'),
                  ':',
                  identifier('format')
                ),
                [callExpression(identifier('tostring'), [identifier('foo')])]
              )
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle equality operator', () => {
      const given = getProgramNode(`
        fizz = foo == bar;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              binaryExpression(identifier('foo'), '==', identifier('bar')),
              `ROBLOX CHECK: loose equality used upstream`
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle inequality operator', () => {
      const given = getProgramNode(`
        fizz = foo != bar;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              binaryExpression(identifier('foo'), '~=', identifier('bar')),
              `ROBLOX CHECK: loose inequality used upstream`
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle strict equality operator', () => {
      const given = getProgramNode(`
        fizz = foo === bar;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [binaryExpression(identifier('foo'), '==', identifier('bar'))]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle strict inequality operator', () => {
      const given = getProgramNode(`
        fizz = foo !== bar;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [binaryExpression(identifier('foo'), '~=', identifier('bar'))]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle in operator (string literal in left side)', () => {
      const given = getProgramNode(`
        fizz = 'foo' in bar
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
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Object'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Object')
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            binaryExpression(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('indexOf')
                ),
                [
                  callExpression(
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('keys')
                    ),
                    [identifier('bar')]
                  ),
                  stringLiteral('foo'),
                ]
              ),
              '~=',
              numericLiteral(-1)
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle in operator (non string literal in left side)', () => {
      const given = getProgramNode(`
        fizz = foo in bar
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
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Object'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Object')
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            binaryExpression(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('indexOf')
                ),
                [
                  callExpression(
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('keys')
                    ),
                    [identifier('bar')]
                  ),
                  callExpression(identifier('tostring'), [identifier('foo')]),
                ]
              ),
              '~=',
              numericLiteral(-1)
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle less than operator', () => {
      const given = getProgramNode(`
        fizz = 3 < 4;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              binaryExpression(
                numericLiteral(3, '3'),
                '<',
                numericLiteral(4, '4')
              ),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle greater than operator', () => {
      const given = getProgramNode(`
        fizz = 3 > 4;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              binaryExpression(
                numericLiteral(3, '3'),
                '>',
                numericLiteral(4, '4')
              ),
              `ROBLOX CHECK: operator '>' works only if either both arguments are strings or both are a number`
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle less than or equals operator', () => {
      const given = getProgramNode(`
        fizz = 3 <= 4;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              binaryExpression(
                numericLiteral(3, '3'),
                '<=',
                numericLiteral(4, '4')
              ),
              `ROBLOX CHECK: operator '<=' works only if either both arguments are strings or both are a number`
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle greater than or equals operator', () => {
      const given = getProgramNode(`
        fizz = 3 >= 4;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              binaryExpression(
                numericLiteral(3, '3'),
                '>=',
                numericLiteral(4, '4')
              ),
              `ROBLOX CHECK: operator '>=' works only if either both arguments are strings or both are a number`
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise and operator', () => {
      const given = getProgramNode(`
        fizz = foo & bar
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              callExpression(
                memberExpression(bit32Identifier(), '.', identifier('band')),
                [identifier('foo'), identifier('bar')]
              ),
              'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise or operator', () => {
      const given = getProgramNode(`
        fizz = foo | bar
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              callExpression(
                memberExpression(bit32Identifier(), '.', identifier('bor')),
                [identifier('foo'), identifier('bar')]
              ),
              'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise xor operator', () => {
      const given = getProgramNode(`
        fizz = foo ^ bar
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              callExpression(
                memberExpression(bit32Identifier(), '.', identifier('bxor')),
                [identifier('foo'), identifier('bar')]
              ),
              'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise unsigned shift right operator', () => {
      const given = getProgramNode(`
        fizz = foo >>> bar
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              callExpression(
                memberExpression(bit32Identifier(), '.', identifier('rshift')),
                [identifier('foo'), identifier('bar')]
              ),
              'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise shift right operator', () => {
      const given = getProgramNode(`
        fizz = foo >> bar
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              callExpression(
                memberExpression(bit32Identifier(), '.', identifier('arshift')),
                [identifier('foo'), identifier('bar')]
              ),
              'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise shift left operator', () => {
      const given = getProgramNode(`
        fizz = foo << bar
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            withTrailingConversionComment(
              callExpression(
                memberExpression(bit32Identifier(), '.', identifier('lshift')),
                [identifier('foo'), identifier('bar')]
              ),
              'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle instanceof operator', () => {
      const given = getProgramNode(`
        fizz = foo instanceof bar
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
          [variableDeclaratorIdentifier(identifier('instanceof'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('instanceof')
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            callExpression(identifier('instanceof'), [
              identifier('foo'),
              identifier('bar'),
            ]),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});

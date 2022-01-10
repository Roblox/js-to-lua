import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
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
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';
import { bit32MethodCall } from '../../../utils/bit-32-method';

const source = '';
describe('Program handler', () => {
  describe('Assignment Statement Handler', () => {
    describe('= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
          foo = bar
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [identifier('bar')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle chained AssignmentStatement', () => {
        const given = getProgramNode(`
          foo = bar = baz
        `);
        const expected = program([
          expressionStatement(
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [identifier('bar')],
                [identifier('baz')]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [identifier('foo')],
                [identifier('bar')]
              ),
            ]) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
          foo.bar = baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
          foo[bar] = baz
          foo['bar'] = baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('+= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
          foo += bar
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.ADD,
              [identifier('foo')],
              [identifier('bar')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle chained AssignmentStatement', () => {
        const given = getProgramNode(`
          foo += bar += baz
        `);
        const expected = program([
          expressionStatement(
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.ADD,
                [identifier('bar')],
                [identifier('baz')]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.ADD,
                [identifier('foo')],
                [identifier('bar')]
              ),
            ]) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
          foo.bar += baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.ADD,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
          foo[bar] += baz
          foo['bar'] += baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.ADD,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.ADD,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle simple AssignmentStatement with string literal on the right', () => {
        const given = getProgramNode(`
          foo += 'bar'
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.CONCAT,
              [identifier('foo')],
              [stringLiteral('bar')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle chained AssignmentStatement with string literal on the right', () => {
        const given = getProgramNode(`
          foo += bar += 'baz'
        `);
        const expected = program([
          expressionStatement(
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.CONCAT,
                [identifier('bar')],
                [stringLiteral('baz')]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.CONCAT,
                [identifier('foo')],
                [identifier('bar')]
              ),
            ]) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left and string literal on the right', () => {
        const given = getProgramNode(`
          foo.bar += 'baz'
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.CONCAT,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [stringLiteral('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left and string literal on the right', () => {
        const given = getProgramNode(`
          foo[bar] += 'baz'
          foo['bar'] += 'baz'
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.CONCAT,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [stringLiteral('baz')]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.CONCAT,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [stringLiteral('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('-= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
          foo -= bar
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.SUB,
              [identifier('foo')],
              [identifier('bar')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle chained AssignmentStatement', () => {
        const given = getProgramNode(`
          foo -= bar -= baz
        `);
        const expected = program([
          expressionStatement(
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.SUB,
                [identifier('bar')],
                [identifier('baz')]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.SUB,
                [identifier('foo')],
                [identifier('bar')]
              ),
            ]) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
          foo.bar -= baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.SUB,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
          foo[bar] -= baz
          foo['bar'] -= baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.SUB,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.SUB,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('*= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
          foo *= bar
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.MUL,
              [identifier('foo')],
              [identifier('bar')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle chained AssignmentStatement', () => {
        const given = getProgramNode(`
          foo *= bar *= baz
        `);
        const expected = program([
          expressionStatement(
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.MUL,
                [identifier('bar')],
                [identifier('baz')]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.MUL,
                [identifier('foo')],
                [identifier('bar')]
              ),
            ]) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
          foo.bar *= baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.MUL,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
          foo[bar] *= baz
          foo['bar'] *= baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.MUL,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.MUL,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('/= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
          foo /= bar
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.DIV,
              [identifier('foo')],
              [identifier('bar')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle chained AssignmentStatement', () => {
        const given = getProgramNode(`
          foo /= bar /= baz
        `);
        const expected = program([
          expressionStatement(
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.DIV,
                [identifier('bar')],
                [identifier('baz')]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.DIV,
                [identifier('foo')],
                [identifier('bar')]
              ),
            ]) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
          foo.bar /= baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.DIV,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
          foo[bar] /= baz
          foo['bar'] /= baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.DIV,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.DIV,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('%= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
          foo %= bar
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.REMAINDER,
              [identifier('foo')],
              [identifier('bar')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle chained AssignmentStatement', () => {
        const given = getProgramNode(`
          foo %= bar %= baz
        `);
        const expected = program([
          expressionStatement(
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.REMAINDER,
                [identifier('bar')],
                [identifier('baz')]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.REMAINDER,
                [identifier('foo')],
                [identifier('bar')]
              ),
            ]) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
          foo.bar %= baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.REMAINDER,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
          foo[bar] %= baz
          foo['bar'] %= baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.REMAINDER,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.REMAINDER,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [identifier('baz')]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('&= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
          foo &= bar
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [
                withTrailingConversionComment(
                  bit32MethodCall('band', identifier('foo'), identifier('bar')),
                  'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
          foo.bar &= baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'band',
                    memberExpression(identifier('foo'), '.', identifier('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
          foo[bar] &= baz
          foo['bar'] &= baz
        `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'band',
                    indexExpression(
                      identifier('foo'),
                      callExpression(identifier('tostring'), [
                        identifier('bar'),
                      ])
                    ),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'band',
                    indexExpression(identifier('foo'), stringLiteral('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('|= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
        foo |= bar
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [
                withTrailingConversionComment(
                  bit32MethodCall('bor', identifier('foo'), identifier('bar')),
                  'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
        foo.bar |= baz
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'bor',
                    memberExpression(identifier('foo'), '.', identifier('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
        foo[bar] |= baz
        foo['bar'] |= baz
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'bor',
                    indexExpression(
                      identifier('foo'),
                      callExpression(identifier('tostring'), [
                        identifier('bar'),
                      ])
                    ),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'bor',
                    indexExpression(identifier('foo'), stringLiteral('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('^= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
        foo ^= bar
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [
                withTrailingConversionComment(
                  bit32MethodCall('bxor', identifier('foo'), identifier('bar')),
                  'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
        foo.bar ^= baz
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'bxor',
                    memberExpression(identifier('foo'), '.', identifier('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
        foo[bar] ^= baz
        foo['bar'] ^= baz
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'bxor',
                    indexExpression(
                      identifier('foo'),
                      callExpression(identifier('tostring'), [
                        identifier('bar'),
                      ])
                    ),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'bxor',
                    indexExpression(identifier('foo'), stringLiteral('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('>>>= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
        foo >>>= bar
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'rshift',
                    identifier('foo'),
                    identifier('bar')
                  ),
                  'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
        foo.bar >>>= baz
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'rshift',
                    memberExpression(identifier('foo'), '.', identifier('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
        foo[bar] >>>= baz
        foo['bar'] >>>= baz
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'rshift',
                    indexExpression(
                      identifier('foo'),
                      callExpression(identifier('tostring'), [
                        identifier('bar'),
                      ])
                    ),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'rshift',
                    indexExpression(identifier('foo'), stringLiteral('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('>>= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
        foo >>= bar
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'arshift',
                    identifier('foo'),
                    identifier('bar')
                  ),
                  'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
        foo.bar >>= baz
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'arshift',
                    memberExpression(identifier('foo'), '.', identifier('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
        foo[bar] >>= baz
        foo['bar'] >>= baz
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'arshift',
                    indexExpression(
                      identifier('foo'),
                      callExpression(identifier('tostring'), [
                        identifier('bar'),
                      ])
                    ),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'arshift',
                    indexExpression(identifier('foo'), stringLiteral('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('<<= operator', () => {
      it('should handle simple AssignmentStatement', () => {
        const given = getProgramNode(`
        foo <<= bar
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'lshift',
                    identifier('foo'),
                    identifier('bar')
                  ),
                  'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with member expression on the left', () => {
        const given = getProgramNode(`
        foo.bar <<= baz
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('foo'), '.', identifier('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'lshift',
                    memberExpression(identifier('foo'), '.', identifier('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle AssignmentStatement with index expression on the left', () => {
        const given = getProgramNode(`
        foo[bar] <<= baz
        foo['bar'] <<= baz
      `);
        const expected = program([
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                indexExpression(
                  identifier('foo'),
                  callExpression(identifier('tostring'), [identifier('bar')])
                ),
              ],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'lshift',
                    indexExpression(
                      identifier('foo'),
                      callExpression(identifier('tostring'), [
                        identifier('bar'),
                      ])
                    ),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
          expressionStatement(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [indexExpression(identifier('foo'), stringLiteral('bar'))],
              [
                withTrailingConversionComment(
                  bit32MethodCall(
                    'lshift',
                    indexExpression(identifier('foo'), stringLiteral('bar')),
                    identifier('baz')
                  ),
                  'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
                ),
              ]
            ) as unknown as LuaExpression
          ),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });
  });

  it(`should handle array destructuring`, () => {
    const given = getProgramNode(`
        ([foo, bar] = baz);
      `);

    const expected = program([
      expressionStatement(
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo'), identifier('bar')],
            [
              callExpression(identifier('table.unpack'), [
                identifier('baz'),
                numericLiteral(1),
                numericLiteral(2),
              ]),
            ]
          ),
        ]) as unknown as LuaExpression
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle array destructuring with nested arrays`, () => {
    const given = getProgramNode(`
        ([foo, [bar, baz]] = fizz);
      `);

    const expected = program([
      expressionStatement(
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
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
            AssignmentStatementOperatorEnum.EQ,
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
        ]) as unknown as LuaExpression
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle array destructuring with rest element`, () => {
    const given = getProgramNode(`
    ([foo, ...bar] = baz);
  `);

    const expected = program([
      expressionStatement(
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
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
            AssignmentStatementOperatorEnum.EQ,
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
        ]) as unknown as LuaExpression
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle object destructuring`, () => {
    const given = getProgramNode(`
    ({foo, bar} = baz);
  `);

    const expected = program([
      expressionStatement(
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo'), identifier('bar')],
          [
            memberExpression(identifier('baz'), '.', identifier('foo')),
            memberExpression(identifier('baz'), '.', identifier('bar')),
          ]
        ) as unknown as LuaExpression
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle object destructuring with aliases`, () => {
    const given = getProgramNode(`
    ({foo:fun, bar:bat} = baz);
  `);

    const expected = program([
      expressionStatement(
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fun'), identifier('bat')],
          [
            memberExpression(identifier('baz'), '.', identifier('foo')),
            memberExpression(identifier('baz'), '.', identifier('bar')),
          ]
        ) as unknown as LuaExpression
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle object destructuring with nested object pattern`, () => {
    const given = getProgramNode(`
    ({foo:{bar, baz}} = fizz);
  `);

    const expected = program([
      expressionStatement(
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
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
        ) as unknown as LuaExpression
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});

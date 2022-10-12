import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  identifier,
  memberExpression,
  numericLiteral,
  unaryExpression,
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

describe('Known Number properties', () => {
  it('should convert JS Number properties that have Lua equivalents', () => {
    const given = getProgramNode(`
      const plusInf = Number.POSITIVE_INFINITY
      const minusInf = Number.NEGATIVE_INFINITY
    `);

    const expected = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('plusInf'))],
        [
          variableDeclaratorValue(
            memberExpression(identifier('math'), '.', identifier('huge'))
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('minusInf'))],
        [
          variableDeclaratorValue(
            unaryExpression(
              '-',
              memberExpression(identifier('math'), '.', identifier('huge'))
            )
          ),
        ]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it('should convert JS Number properties that have Polyfills', () => {
    const given = getProgramNode(`
      let foo
      foo = Number.isFinite
      foo = Number.isInteger
      foo = Number.isNaN
      foo = Number.isSafeInteger
      foo = Number.NaN
      foo = Number.MAX_SAFE_INTEGER
      foo = Number.MIN_SAFE_INTEGER
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
        [variableDeclaratorIdentifier(identifier('Number'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Number')
            )
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        []
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [memberExpression(identifier('Number'), '.', identifier('isFinite'))]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [memberExpression(identifier('Number'), '.', identifier('isInteger'))]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [memberExpression(identifier('Number'), '.', identifier('isNaN'))]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [
          memberExpression(
            identifier('Number'),
            '.',
            identifier('isSafeInteger')
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [memberExpression(identifier('Number'), '.', identifier('NaN'))]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [
          memberExpression(
            identifier('Number'),
            '.',
            identifier('MAX_SAFE_INTEGER')
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [
          memberExpression(
            identifier('Number'),
            '.',
            identifier('MIN_SAFE_INTEGER')
          ),
        ]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it('should convert JS Number properties that do NOT have Polyfills', () => {
    const given = getProgramNode(`
      let foo
      foo = Number.parseFloat
      foo = Number.parseInt
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
        [variableDeclaratorIdentifier(identifier('Number'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Number')
            )
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        []
      ),

      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [
          withTrailingConversionComment(
            memberExpression(
              identifier('Number'),
              '.',
              identifier('parseFloat')
            ),
            'ROBLOX NOTE: Number.parseFloat is currently not supported by the Luau Number polyfill, please add your own implementation or file a ticket on the same'
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [
          withTrailingConversionComment(
            memberExpression(identifier('Number'), '.', identifier('parseInt')),
            'ROBLOX NOTE: Number.parseInt is currently not supported by the Luau Number polyfill, please add your own implementation or file a ticket on the same'
          ),
        ]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it('should convert JS Number constants', () => {
    const given = getProgramNode(`
      const MAX_VALUE = Number.MAX_VALUE;
      const MIN_VALUE = Number.MIN_VALUE
      const EPSILON = Number.EPSILON
    `);

    const expected = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Number_EPSILON'))],
        [variableDeclaratorValue(numericLiteral(2.220446049250313e-16))]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Number_MAX_VALUE'))],
        [variableDeclaratorValue(numericLiteral(1.7976931348623157e308))]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Number_MIN_VALUE'))],
        [variableDeclaratorValue(numericLiteral(5e-324))]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('MAX_VALUE'))],
        [variableDeclaratorValue(identifier('Number_MAX_VALUE'))]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('MIN_VALUE'))],
        [variableDeclaratorValue(identifier('Number_MIN_VALUE'))]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('EPSILON'))],
        [variableDeclaratorValue(identifier('Number_EPSILON'))]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });
});

import {
  dateTimeMethodCall,
  tableUnpackCall,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  expressionStatement,
  identifier,
  indexExpression,
  memberExpression,
  numericLiteral,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

describe('Program handler', () => {
  describe('Call Expression Handler', () => {
    it('should handle function call expression:', () => {
      const source = `
        foo(1, 2)
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        expressionStatement(
          callExpression(identifier('foo'), [
            numericLiteral(1, '1'),
            numericLiteral(2, '2'),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle function call expression using call', () => {
      const source = `
        foo.call(fooThis, 1, 2)
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        expressionStatement(
          callExpression(identifier('foo'), [
            identifier('fooThis'),
            numericLiteral(1, '1'),
            numericLiteral(2, '2'),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle function call expression using apply with one param', () => {
      const source = `
        foo.apply(fooThis)
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        expressionStatement(
          callExpression(identifier('foo'), [identifier('fooThis')])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle function call expression using apply with two params', () => {
      const source = `
        foo.apply(fooThis, fooArgs)
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        expressionStatement(
          callExpression(identifier('foo'), [
            identifier('fooThis'),
            tableUnpackCall(identifier('fooArgs')),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle function call expression using apply with more than two params', () => {
      const source = `
        foo.apply(fooArg0, fooArg1, fooArg2)
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        expressionStatement(
          callExpression(
            memberExpression(identifier('foo'), ':', identifier('apply')),
            [
              identifier('fooArg0'),
              identifier('fooArg1'),
              identifier('fooArg2'),
            ]
          )
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle Date.now() call', () => {
      const source = `
        const t = Date.now()
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('t'))],
          [
            variableDeclaratorValue(
              memberExpression(
                dateTimeMethodCall('now'),
                '.',
                identifier('UnixTimestampMillis')
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle parseInt simple function call', () => {
      const source = `
        parseInt(foo)
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        expressionStatement(
          callExpression(identifier('tonumber'), [identifier('foo')])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle parseInt with base function call', () => {
      const source = `
        parseInt(foo, 16)
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        expressionStatement(
          callExpression(identifier('tonumber'), [
            identifier('foo'),
            numericLiteral(16, '16'),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    describe('Special cases', () => {
      it('should handle new Symbol creation', () => {
        const source = `
          s = Symbol("foo")
        `;
        const given = getProgramNode(source);

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
            [variableDeclaratorIdentifier(identifier('Symbol'))],
            [
              variableDeclaratorValue(
                memberExpression(
                  identifier('LuauPolyfill'),
                  '.',
                  identifier('Symbol')
                )
              ),
            ]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('s')],
            [callExpression(identifier('Symbol'), [stringLiteral('foo')])]
          ),
        ]);

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });

      it('should handle Symbol.for call', () => {
        const source = `
          s = Symbol.for("foo")
        `;
        const given = getProgramNode(source);

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
            [variableDeclaratorIdentifier(identifier('Symbol'))],
            [
              variableDeclaratorValue(
                memberExpression(
                  identifier('LuauPolyfill'),
                  '.',
                  identifier('Symbol')
                )
              ),
            ]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('s')],
            [
              callExpression(
                memberExpression(identifier('Symbol'), '.', identifier('for_')),
                [stringLiteral('foo')]
              ),
            ]
          ),
        ]);

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });

      it('should handle Symbol["for"] call', () => {
        const source = `
          s = Symbol["for"]("foo")
        `;
        const given = getProgramNode(source);

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
            [variableDeclaratorIdentifier(identifier('Symbol'))],
            [
              variableDeclaratorValue(
                memberExpression(
                  identifier('LuauPolyfill'),
                  '.',
                  identifier('Symbol')
                )
              ),
            ]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('s')],
            [
              callExpression(
                memberExpression(identifier('Symbol'), '.', identifier('for_')),
                [stringLiteral('foo')]
              ),
            ]
          ),
        ]);

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });

      it('should handle Symbol.aMethod call', () => {
        const source = `
          s = Symbol.aMethod("foo")
        `;
        const given = getProgramNode(source);

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
            [variableDeclaratorIdentifier(identifier('Symbol'))],
            [
              variableDeclaratorValue(
                memberExpression(
                  identifier('LuauPolyfill'),
                  '.',
                  identifier('Symbol')
                )
              ),
            ]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('s')],
            [
              callExpression(
                memberExpression(
                  identifier('Symbol'),
                  '.',
                  identifier('aMethod')
                ),
                [stringLiteral('foo')]
              ),
            ]
          ),
        ]);

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });

      it('should handle Symbol[aMethod] call', () => {
        const source = `
          s = Symbol[aMethod]("foo")
        `;
        const given = getProgramNode(source);

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
            [variableDeclaratorIdentifier(identifier('Symbol'))],
            [
              variableDeclaratorValue(
                memberExpression(
                  identifier('LuauPolyfill'),
                  '.',
                  identifier('Symbol')
                )
              ),
            ]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('s')],
            [
              callExpression(
                indexExpression(
                  identifier('Symbol'),
                  callExpression(identifier('tostring'), [
                    identifier('aMethod'),
                  ])
                ),
                [stringLiteral('foo')]
              ),
            ]
          ),
        ]);

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });
    });
  });
});

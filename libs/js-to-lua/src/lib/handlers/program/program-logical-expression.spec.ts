import { getProgramNode } from './program.spec.utils';
import {
  binaryExpression,
  booleanLiteral,
  booleanMethod,
  callExpression,
  elseClause,
  expressionStatement,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaProgram,
  nilLiteral,
  numericLiteral,
  program,
  returnStatement,
  stringLiteral,
  tableConstructor,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('Logical expression', () => {
    it('should handle || operator', () => {
      const given = getProgramNode('foo || bar;');

      const expected: LuaProgram = program([
        expressionStatement(
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.AND,
            callExpression(booleanMethod('toJSBoolean'), [identifier('foo')]),
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.OR,
              identifier('foo'),
              identifier('bar')
            )
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, given);

      expect(luaProgram).toEqual(expected);
    });

    describe(`should handle && operator`, () => {
      it('when right side is unknown', () => {
        const given = getProgramNode('foo && bar;');

        const expected: LuaProgram = program([
          expressionStatement(
            callExpression(
              functionExpression(
                [],
                [
                  ifStatement(
                    ifClause(
                      callExpression(booleanMethod('toJSBoolean'), [
                        identifier('foo'),
                      ]),
                      [returnStatement(identifier('bar'))]
                    ),
                    [],
                    elseClause([returnStatement(identifier('foo'))])
                  ),
                ]
              ),
              []
            )
          ),
        ]);

        const luaProgram = handleProgram.handler(source, given);

        expect(luaProgram).toEqual(expected);
      });

      const falsyValues = [
        {
          code: 'foo && false',
          leftExpected: identifier('foo'),
          rightExpected: booleanLiteral(false),
        },
        {
          code: 'foo && null',
          leftExpected: identifier('foo'),
          rightExpected: nilLiteral(),
        },
        {
          code: 'foo && undefined',
          leftExpected: identifier('foo'),
          rightExpected: nilLiteral(),
        },
      ];

      falsyValues.forEach(({ code, leftExpected, rightExpected }) => {
        it(`when right side is falsy: ${JSON.stringify(code)}`, () => {
          const given = getProgramNode(code);

          const expected: LuaProgram = program([
            expressionStatement(
              callExpression(
                functionExpression(
                  [],
                  [
                    ifStatement(
                      ifClause(
                        callExpression(booleanMethod('toJSBoolean'), [
                          leftExpected,
                        ]),
                        [returnStatement(rightExpected)]
                      ),
                      [],
                      elseClause([returnStatement(leftExpected)])
                    ),
                  ]
                ),
                []
              )
            ),
          ]);

          const luaProgram = handleProgram.handler(source, given);

          expect(luaProgram).toEqual(expected);
        });
      });

      const truthyValues = [
        {
          code: 'foo && 0',
          leftExpected: identifier('foo'),
          rightExpected: numericLiteral(0, '0'),
        },
        {
          code: 'foo && 1',
          leftExpected: identifier('foo'),
          rightExpected: numericLiteral(1, '1'),
        },
        {
          code: 'foo && ""',
          leftExpected: identifier('foo'),
          rightExpected: stringLiteral(''),
        },
        {
          code: 'foo && "abc"',
          leftExpected: identifier('foo'),
          rightExpected: stringLiteral('abc'),
        },
        {
          code: 'foo && true',
          leftExpected: identifier('foo'),
          rightExpected: booleanLiteral(true),
        },
        {
          code: 'foo && {}',
          leftExpected: identifier('foo'),
          rightExpected: tableConstructor([]),
        },
        {
          code: 'foo && []',
          leftExpected: identifier('foo'),
          rightExpected: tableConstructor([]),
        },
        {
          code: 'foo && NaN',
          leftExpected: identifier('foo'),
          rightExpected: binaryExpression(
            numericLiteral(0),
            '/',
            numericLiteral(0)
          ),
        },
      ];

      truthyValues.forEach(({ code, leftExpected, rightExpected }) => {
        it(`when right side is truthy in Lua: ${JSON.stringify(code)}`, () => {
          const given = getProgramNode(code);

          const expected: LuaProgram = program([
            expressionStatement(
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.AND,
                callExpression(booleanMethod('toJSBoolean'), [leftExpected]),
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.OR,
                  rightExpected,
                  leftExpected
                )
              )
            ),
          ]);

          const luaProgram = handleProgram.handler(source, given);

          expect(luaProgram).toEqual(expected);
        });
      });
    });
  });
});

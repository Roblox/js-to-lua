import { getProgramNode } from './program.spec.utils';
import {
  booleanMethod,
  callExpression,
  expressionStatement,
  identifier,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaProgram,
  program,
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
  });
});

import { unhandledIdentifier } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaExpression,
  LuaProgram,
  numericLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';

export function addMathConsts(program: LuaProgram) {
  const extras = program.extras || {};
  const mathConsts = Object.keys(extras)
    .filter((key) => key.startsWith('mathConst.'))
    .map((key) => key.split('.')[1])
    .sort();

  const mathPropertyMap: Record<string, LuaExpression> = {
    E: numericLiteral(Math.E),
    LN2: numericLiteral(Math.LN2),
    LN10: numericLiteral(Math.LN10),
    LOG2E: numericLiteral(Math.LOG2E),
    LOG10E: numericLiteral(Math.LOG10E),
    SQRT1_2: numericLiteral(Math.SQRT1_2),
    SQRT2: numericLiteral(Math.SQRT2),
  };

  return mathConsts.length
    ? {
        ...program,
        body: [
          ...mathConsts.map((key) =>
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier(`Math_${key}`))],
              [
                variableDeclaratorValue(
                  mathPropertyMap[key] || unhandledIdentifier()
                ),
              ]
            )
          ),
          ...program.body,
        ],
      }
    : program;
}

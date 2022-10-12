import {
  getNumberConstExtras,
  NumberConst,
  numberConstIdentifier,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaProgram,
  numericLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';

export function addNumberConsts(program: LuaProgram) {
  const extras = program.extras || {};
  const numberConsts = getNumberConstExtras(extras);

  const propertyMap: Record<NumberConst, LuaExpression> = {
    EPSILON: numericLiteral(Number.EPSILON),
    MIN_VALUE: numericLiteral(Number.MIN_VALUE),
    MAX_VALUE: numericLiteral(Number.MAX_VALUE),
  };

  return numberConsts.length
    ? {
        ...program,
        body: [
          ...numberConsts.map((key) =>
            variableDeclaration(
              [variableDeclaratorIdentifier(numberConstIdentifier(key))],
              [variableDeclaratorValue(propertyMap[key])]
            )
          ),
          ...program.body,
        ],
      }
    : program;
}

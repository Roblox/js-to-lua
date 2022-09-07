import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  LuaExpression,
  LuaIdentifier,
  LuaStatement,
  LuaTypeAnnotation,
  nilLiteral,
  typeAnnotation,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { inferType } from '../../type/infer-type';

export const createAssignmentPatternHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Babel.Identifier>
) =>
  createHandlerFunction<
    LuaStatement,
    Babel.AssignmentPattern,
    { refTypeAnnotation?: LuaTypeAnnotation }
  >((source, config, node) => {
    const rightExpression = handleExpression(source, config, node.right);
    if (Babel.isIdentifier(node.left)) {
      const leftExpression = handleIdentifier(source, config, node.left);
      const leftTemporaryExpression = identifier(leftExpression.name + '_');
      const leftExpressionTyped = {
        ...leftExpression,
        typeAnnotation:
          config.refTypeAnnotation ||
          typeAnnotation(
            leftExpression.typeAnnotation?.typeAnnotation ||
              inferType(node.right)
          ),
      };
      return variableDeclaration(
        [variableDeclaratorIdentifier(leftExpressionTyped)],
        [
          variableDeclaratorValue(
            ifElseExpression(
              ifExpressionClause(
                binaryExpression(leftTemporaryExpression, '~=', nilLiteral()),
                leftTemporaryExpression
              ),
              elseExpressionClause(rightExpression)
            )
          ),
        ]
      );
    }
    return withTrailingConversionComment(
      unhandledStatement(),
      `ROBLOX TODO: Unhandled assignment pattern handling for type: "${node.left.type}"`,
      getNodeSource(source, node)
    );
  });

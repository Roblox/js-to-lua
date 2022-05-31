import {
  binaryExpression,
  isBinaryExpression,
  isMultilineStringLiteral,
  isStringLiteral,
  LuaExpression,
  multilineStringLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { reassignComments } from '../comment';
import { joinMultilineStringLiterals } from './join-multiline-string-literals';
import { joinStringLiterals } from './join-string-literals';

export const joinExpressionsWith =
  (separator: string) =>
  (left: LuaExpression, right: LuaExpression): LuaExpression => {
    if (isStringLiteral(left) && isStringLiteral(right)) {
      return joinStringLiterals(separator)(left, right);
    }
    if (isMultilineStringLiteral(left) && isMultilineStringLiteral(right)) {
      return joinMultilineStringLiterals(separator)(left, right);
    }

    if (isStringLiteral(left) || isMultilineStringLiteral(left)) {
      return binaryExpression(
        reassignComments(
          (isStringLiteral(left) ? stringLiteral : multilineStringLiteral)(
            left.value + separator
          ),
          left
        ),
        '..',
        right
      );
    }

    if (isBinaryExpression(left) && left.operator === '..') {
      if (
        isMultilineStringLiteral(left.right) &&
        isMultilineStringLiteral(right)
      ) {
        return reassignComments(
          binaryExpression(
            left.left,
            '..',
            joinMultilineStringLiterals(separator)(left.right, right)
          ),
          left
        );
      }
      if (isStringLiteral(left.right) && isStringLiteral(right)) {
        return reassignComments(
          binaryExpression(
            left.left,
            '..',
            joinStringLiterals(separator)(left.right, right)
          ),
          left
        );
      }

      if (isStringLiteral(left.right) || isMultilineStringLiteral(left.right)) {
        return binaryExpression(
          reassignComments(
            binaryExpression(
              left.left,
              '..',
              reassignComments(
                (isStringLiteral(left.right)
                  ? stringLiteral
                  : multilineStringLiteral)(left.right.value + separator),
                left.right
              )
            ),
            left
          ),
          '..',
          right
        );
      }
    }

    if (isStringLiteral(right) || isMultilineStringLiteral(right)) {
      return binaryExpression(
        left,
        '..',
        reassignComments(
          (isStringLiteral(right) ? stringLiteral : multilineStringLiteral)(
            separator + right.value
          ),
          right
        )
      );
    }

    return binaryExpression(
      binaryExpression(left, '..', stringLiteral(separator)),
      '..',
      right
    );
  };

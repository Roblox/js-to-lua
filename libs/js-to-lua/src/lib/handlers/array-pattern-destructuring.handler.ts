import {
  Identifier,
  isArrayPattern,
  isIdentifier,
  isRestElement,
  LVal,
  PatternLike,
  ArrayPattern,
} from '@babel/types';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { anyPass } from 'ramda';

export function handleArrayPatternDestructuring(
  elements: PatternLike[],
  init: LuaExpression
) {
  const nodes: { ids: LVal[]; values: LuaCallExpression[] }[] = [];
  let tempIdentifierNodes: Identifier[] = [];
  let startIndex: number | null = null;

  elements.forEach((el, i) => {
    if (isIdentifier(el)) {
      startIndex = startIndex == null ? i : startIndex;
      tempIdentifierNodes.push(el);
      if (i === elements.length - 1) {
        flushIdentifierDeclarations(startIndex, i);
      }
    } else {
      flushIdentifierDeclarations(startIndex!, i - 1);

      if (isRestElement(el)) {
        nodes.push({
          ids: [el.argument],
          values: [
            callExpression(identifier('table.pack'), [
              callExpression(identifier('table.unpack'), [
                init,
                numericLiteral(i + 1),
              ]),
            ]),
          ],
        });
      } else if (isArrayPattern(el)) {
        nodes.push(
          ...handleArrayPatternDestructuring(
            el.elements.filter(isTruthy),
            callExpression(identifier('table.unpack'), [
              init,
              numericLiteral(i + 1),
              numericLiteral(i + 1),
            ])
          )
        );
      }
    }
  });

  return nodes;

  function flushIdentifierDeclarations(fromIndex: number, toIndex: number) {
    if (tempIdentifierNodes.length) {
      nodes.push({
        ids: tempIdentifierNodes,
        values: [
          callExpression(identifier('table.unpack'), [
            init,
            numericLiteral(fromIndex + 1),
            numericLiteral(toIndex + 1),
          ]),
        ],
      });
    }
    tempIdentifierNodes = [];
    startIndex = null;
  }
}

export function hasUnhandledArrayDestructuringParam(
  elements: PatternLike[]
): boolean {
  return (
    elements.some(
      (el) =>
        !anyPass([isIdentifier, isRestElement, isArrayPattern])(el, undefined)
    ) ||
    elements
      .filter((el): el is ArrayPattern => isArrayPattern(el))
      .map((el) =>
        hasUnhandledArrayDestructuringParam(el.elements.filter(isTruthy))
      )
      .filter(Boolean).length > 0
  );
}

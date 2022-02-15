import {
  ArrayPattern,
  Expression,
  Identifier,
  isArrayPattern as isBabelArrayPattern,
  isAssignmentPattern as isBabelAssignmentPattern,
  isIdentifier as isBabelIdentifier,
  isRestElement as isBabelRestElement,
  LVal,
  PatternLike,
} from '@babel/types';
import {
  binaryExpression,
  callExpression,
  elseClause,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  LuaCallExpression,
  LuaExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  returnStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { isTruthy, splitBy } from '@js-to-lua/shared-utils';
import { anyPass, last } from 'ramda';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';

interface DestructuredArrayPattern {
  ids: LVal[];
  values: LuaCallExpression[];
}
type NotIdentifier = Exclude<PatternLike, Identifier>;
interface DestructuredGroup {
  startIndex: number;
  endIndex: number;
  group: NotIdentifier | Identifier[];
}

export const createArrayPatternDestructuringHandler =
  (handleExpression: HandlerFunction<LuaExpression, Expression>) =>
  (
    source: string,
    config: EmptyConfig,
    elements: PatternLike[],
    init: LuaExpression
  ): DestructuredArrayPattern[] => {
    return handleArrayPatternDestructuring(elements, init);

    function handleArrayPatternDestructuring(
      elements: PatternLike[],
      init: LuaExpression
    ): DestructuredArrayPattern[] {
      return elements
        .reduce(
          splitBy<PatternLike, NotIdentifier>(
            (node): node is NotIdentifier => !isBabelIdentifier(node)
          ),
          []
        )
        .reduce((result, group) => {
          const startIndex = (last(result)?.endIndex || 0) + 1;
          const groupLength = Array.isArray(group) ? group.length : 1;
          return [
            ...result,
            {
              group,
              startIndex,
              endIndex: startIndex + groupLength - 1,
            },
          ];
        }, Array<DestructuredGroup>())
        .map(({ group, startIndex, endIndex }) =>
          Array.isArray(group)
            ? handleIdentifier(group, startIndex, endIndex)
            : handleNotIdentifier(group, startIndex, endIndex)
        )
        .flat();

      function handleIdentifier(
        group: Identifier[],
        startIndex: number,
        endIndex: number
      ): DestructuredArrayPattern {
        return {
          ids: group,
          values: [
            callExpression(identifier('table.unpack'), [
              init,
              numericLiteral(startIndex),
              numericLiteral(endIndex),
            ]),
          ],
        };
      }

      function handleNotIdentifier(
        el: NotIdentifier,
        startIndex: number,
        endIndex: number
      ): DestructuredArrayPattern[] {
        if (isBabelRestElement(el)) {
          return [
            {
              ids: [el.argument],
              values: [
                callExpression(identifier('table.pack'), [
                  callExpression(identifier('table.unpack'), [
                    init,
                    numericLiteral(startIndex),
                  ]),
                ]),
              ],
            },
          ];
        } else if (isBabelArrayPattern(el)) {
          return handleArrayPatternDestructuring(
            el.elements.filter(isTruthy),
            callExpression(identifier('table.unpack'), [
              init,
              numericLiteral(startIndex),
              numericLiteral(endIndex),
            ])
          );
        } else if (isBabelAssignmentPattern(el) && isBabelIdentifier(el.left)) {
          return [
            {
              ids: [el.left],
              values: [
                callExpression(
                  functionExpression(
                    [],
                    nodeGroup([
                      variableDeclaration(
                        [variableDeclaratorIdentifier(identifier('element'))],
                        [
                          variableDeclaratorValue(
                            callExpression(identifier('table.unpack'), [
                              init,
                              numericLiteral(startIndex),
                              numericLiteral(endIndex),
                            ])
                          ),
                        ]
                      ),
                      ifStatement(
                        ifClause(
                          binaryExpression(
                            identifier('element'),
                            '==',
                            nilLiteral()
                          ),
                          nodeGroup([
                            returnStatement(
                              handleExpression(source, config, el.right)
                            ),
                          ])
                        ),
                        undefined,
                        elseClause(
                          nodeGroup([returnStatement(identifier('element'))])
                        )
                      ),
                    ])
                  ),
                  []
                ),
              ],
            },
          ];
        }
        // should never reach this code because `hasUnhandledArrayDestructuringParam` check is called before
        throw new Error(
          `Unhandled node for type ${el.type} when destructuring an Array Pattern`
        );
      }
    }
  };
export function hasUnhandledArrayDestructuringParam(
  elements: PatternLike[]
): boolean {
  return (
    elements.some(
      (el) =>
        !anyPass([
          isBabelIdentifier,
          isBabelRestElement,
          isBabelArrayPattern,
          isHandledAssignmentPattern,
        ])(el)
    ) ||
    elements
      .filter((el): el is ArrayPattern => isBabelArrayPattern(el))
      .map((el) =>
        hasUnhandledArrayDestructuringParam(el.elements.filter(isTruthy))
      )
      .filter(Boolean).length > 0
  );
}

function isHandledAssignmentPattern(node: PatternLike | null | undefined) {
  return isBabelAssignmentPattern(node) && isBabelIdentifier(node.left);
}

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
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  tablePackCall,
  tableUnpackCall,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseClause,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  indexExpression,
  LuaCallExpression,
  LuaExpression,
  LuaIndexExpression,
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

interface DestructuredArrayPattern {
  ids: LVal[];
  values: (LuaIndexExpression | LuaCallExpression)[];
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
        const values = [
          group.length === 1
            ? indexExpression(init, numericLiteral(startIndex))
            : tableUnpackCall(
                init,
                numericLiteral(startIndex),
                numericLiteral(endIndex)
              ),
        ];

        return {
          ids: group,
          values,
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
                tablePackCall(
                  tableUnpackCall(init, numericLiteral(startIndex))
                ),
              ],
            },
          ];
        } else if (isBabelArrayPattern(el)) {
          return handleArrayPatternDestructuring(
            el.elements.filter(isTruthy),
            tableUnpackCall(
              init,
              numericLiteral(startIndex),
              numericLiteral(endIndex)
            )
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
                            tableUnpackCall(
                              init,
                              numericLiteral(startIndex),
                              numericLiteral(endIndex)
                            )
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
          `Unhandled node for type ${
            el.type
          } when destructuring an Array Pattern ${getNodeSource(source, el)}`
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
        ])(
          el,
          // TODO: improve ramda types
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          undefined
        )
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

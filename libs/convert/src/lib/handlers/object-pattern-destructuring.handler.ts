import {
  Expression,
  isAssignmentPattern,
  isIdentifier,
  isObjectPattern,
  isObjectProperty,
  isRestElement,
  LVal,
  ObjectMethod,
  ObjectPattern,
  ObjectProperty,
  PatternLike,
  RestElement,
} from '@babel/types';
import { objectAssign, objectNone } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseClause,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  LuaExpression,
  LuaIdentifier,
  LuaIndexExpression,
  LuaLVal,
  LuaMemberExpression,
  LuaTableKeyField,
  nilLiteral,
  nodeGroup,
  returnStatement,
  tableConstructor,
} from '@js-to-lua/lua-types';
import { anyPass } from 'ramda';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { createPropertyFromBaseHandler } from './expression/property-from-base.handler';

export const createObjectPatternDestructuringHandler =
  (
    handleExpression: HandlerFunction<LuaExpression, Expression>,
    handleLVal: HandlerFunction<LuaLVal, LVal>,
    handleObjectField: HandlerFunction<
      LuaTableKeyField,
      ObjectMethod | ObjectProperty
    >
  ): ((
    source: string,
    config: EmptyConfig,
    id: LuaIdentifier,
    properties: (ObjectProperty | RestElement)[]
  ) => {
    ids: LuaIdentifier[];
    values: LuaExpression[];
  }) =>
  (source, config, id, properties) => {
    const { ids, values } = getObjectPropertiesIdentifiersAndValues(
      properties,
      id
    );

    return { ids, values };

    function getObjectPropertiesIdentifiersAndValues(
      properties: (RestElement | ObjectProperty)[],
      base: LuaIdentifier | LuaMemberExpression | LuaIndexExpression
    ): {
      ids: LuaIdentifier[];
      values: LuaExpression[];
    } {
      const handlePropertyFromBase = createPropertyFromBaseHandler(
        handleExpression,
        base
      )(source, config);

      return properties.reduce(
        (obj, property) => {
          if (isObjectProperty(property) && isIdentifier(property.value)) {
            obj.ids.push(identifier(property.value.name));
            obj.values.push(handlePropertyFromBase(property));
          } else if (
            isObjectProperty(property) &&
            isObjectPattern(property.value)
          ) {
            const { ids, values } = getObjectPropertiesIdentifiersAndValues(
              property.value.properties as ObjectProperty[],
              handlePropertyFromBase(property)
            );

            obj.ids.push(...ids);
            obj.values.push(...values);
          } else if (
            isObjectProperty(property) &&
            isAssignmentPattern(property.value) &&
            isIdentifier(property.value.left)
          ) {
            obj.ids.push(identifier(property.value.left.name));
            obj.values.push(
              callExpression(
                functionExpression(
                  [],
                  nodeGroup([
                    ifStatement(
                      ifClause(
                        binaryExpression(
                          handlePropertyFromBase(property),
                          '==',
                          nilLiteral()
                        ),
                        nodeGroup([
                          returnStatement(
                            handleExpression(
                              source,
                              config,
                              property.value.right
                            )
                          ),
                        ])
                      ),
                      undefined,
                      elseClause(
                        nodeGroup([
                          returnStatement(handlePropertyFromBase(property)),
                        ])
                      )
                    ),
                  ])
                ),
                []
              )
            );
          } else if (isRestElement(property)) {
            obj.ids.push(handleLVal(source, config, property.argument));
            obj.values.push(
              callExpression(objectAssign(), [
                tableConstructor(),
                base,
                tableConstructor([
                  ...properties
                    .filter((property): property is ObjectProperty =>
                      isObjectProperty(property)
                    )
                    .map((property) => ({
                      ...handleObjectField(source, config, property),
                      value: objectNone(),
                    })),
                ]),
              ])
            );
          }
          return obj;
        },
        {
          ids: Array<LuaIdentifier>(),
          values: Array<LuaExpression>(),
        }
      );
    }
  };

export function hasUnhandledObjectDestructuringParam(
  properties: ObjectProperty[]
): boolean {
  return (
    properties.some(
      (el) =>
        !anyPass([isIdentifier, isObjectPattern, isHandledAssignmentPattern])(
          el.value
        )
    ) ||
    properties
      .map((property) => property.value)
      .filter((value): value is ObjectPattern => isObjectPattern(value))
      .map((value) =>
        hasUnhandledObjectDestructuringParam(
          value.properties.filter((prop): prop is ObjectProperty =>
            isObjectProperty(prop)
          )
        )
      )
      .filter(Boolean).length > 0
  );
}

function isHandledAssignmentPattern(
  node: Expression | PatternLike | null | undefined
) {
  return isAssignmentPattern(node) && isIdentifier(node.left);
}
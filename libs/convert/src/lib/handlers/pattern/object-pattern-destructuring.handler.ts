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
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { objectAssign, objectNone } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  ifElseExpression,
  ifExpressionClause,
  LuaExpression,
  LuaIdentifier,
  LuaIndexExpression,
  LuaLVal,
  LuaMemberExpression,
  LuaTableKeyField,
  nilLiteral,
  tableConstructor,
} from '@js-to-lua/lua-types';
import { anyPass } from 'ramda';
import { IdentifierStrictHandlerFunction } from '../expression/identifier-handler-types';
import { createPropertyFromBaseHandler } from '../expression/property-from-base.handler';

export const createObjectPatternDestructuringHandler =
  (
    handleExpression: HandlerFunction<LuaExpression, Expression>,
    handleLVal: HandlerFunction<LuaLVal, LVal>,
    handleIdentifierStrict: IdentifierStrictHandlerFunction,
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
            const valueIdentifier = handleIdentifierStrict(
              source,
              config,
              property.value
            );
            obj.ids.push(valueIdentifier);
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
            const propertyValueIdentifier = handleIdentifierStrict(
              source,
              config,
              property.value.left
            );
            obj.ids.push(propertyValueIdentifier);
            obj.values.push(
              ifElseExpression(
                ifExpressionClause(
                  binaryExpression(
                    handlePropertyFromBase(property),
                    '==',
                    nilLiteral()
                  ),
                  handleExpression(source, config, property.value.right)
                ),
                elseExpressionClause(handlePropertyFromBase(property))
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
          el.value,
          // TODO: improve ramda types
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          undefined
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

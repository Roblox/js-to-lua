import {
  Expression,
  isIdentifier,
  isObjectPattern,
  isObjectProperty,
  isRestElement,
  LVal,
  ObjectMethod,
  ObjectProperty,
  RestElement,
} from '@babel/types';
import {
  callExpression,
  identifier,
  indexExpression,
  LuaExpression,
  LuaIdentifier,
  LuaIndexExpression,
  LuaLVal,
  LuaMemberExpression,
  LuaTableKeyField,
  objectAssign,
  objectNone,
  tableConstructor,
} from '@js-to-lua/lua-types';
import { EmptyConfig, HandlerFunction } from '../types';
import { createPropertyFromBaseHandler } from './expression/property-from-base.handler';

export const createObjectPatternDestructuringHandler = (
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
  values: (LuaExpression | null)[];
}) => (source, config, id, properties) => {
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
    values: (LuaExpression | null)[];
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
        ids: <LuaIdentifier[]>[],
        values: <(LuaExpression | null)[]>[],
      }
    );
  }
};

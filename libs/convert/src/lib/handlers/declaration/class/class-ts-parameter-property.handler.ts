import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaTypeAnnotation,
  typeAnnotation,
  typeAny,
} from '@js-to-lua/lua-types';
import { inferType } from '../../type/infer-type';

export const createClassTsParameterPropertyHandler = (
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >
) =>
  createHandlerFunction<LuaTypeAnnotation, Babel.TSParameterProperty>(
    (source, config, property) => {
      return property.parameter.typeAnnotation
        ? handleTypeAnnotation(
            source,
            config,
            property.parameter.typeAnnotation
          )
        : Babel.isAssignmentPattern(property.parameter)
        ? !Babel.isMemberExpression(property.parameter.left) &&
          property.parameter.left.typeAnnotation
          ? handleTypeAnnotation(
              source,
              config,
              property.parameter.left.typeAnnotation
            )
          : typeAnnotation(inferType(property.parameter.right))
        : typeAnnotation(typeAny());
    }
  );

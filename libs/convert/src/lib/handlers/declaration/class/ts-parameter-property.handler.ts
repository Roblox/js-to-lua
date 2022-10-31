import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  removeTypeAnnotation,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaIdentifier,
  LuaLVal,
  LuaPropertySignature,
  LuaTypeAnnotation,
  typePropertySignature,
} from '@js-to-lua/lua-types';
import { createClassTsParameterPropertyHandler } from './class-ts-parameter-property.handler';

export const createParameterPropertyHandler = (
  handleIdentifier: HandlerFunction<LuaLVal, Babel.LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >
) => {
  let unhandledAssignments = 0;
  return createHandlerFunction<LuaPropertySignature, Babel.TSParameterProperty>(
    (source, config, property) => {
      const handleClassTsParameterProperty =
        createClassTsParameterPropertyHandler(handleTypeAnnotation)(
          source,
          config
        );

      const id = toParameterPropertyIdentifier(
        source,
        config,
        property.parameter
      );
      return typePropertySignature(
        removeTypeAnnotation(id),
        handleClassTsParameterProperty(property)
      );
    }
  );

  function toParameterPropertyIdentifier(
    source: string,
    config: EmptyConfig,
    parameter: Babel.Identifier | Babel.AssignmentPattern
  ): LuaIdentifier {
    if (Babel.isIdentifier(parameter)) {
      return handleIdentifier(source, config, parameter);
    } else if (Babel.isIdentifier(parameter.left)) {
      return handleIdentifier(source, config, parameter.left);
    } else {
      return withTrailingConversionComment(
        identifier(`__unhandled__${'_'.repeat(unhandledAssignments++)}`),
        getNodeSource(source, parameter.left)
      );
    }
  }
};

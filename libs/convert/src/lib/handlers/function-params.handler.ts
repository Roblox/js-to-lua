import * as Babel from '@babel/types';
import { HandlerFunction } from '@js-to-lua/handler-utils';
import {
  generateUniqueIdentifier,
  removeIdTypeAnnotation,
} from '@js-to-lua/lua-conversion-utils';
import {
  functionParamEllipse,
  functionParamName,
  functionTypeParamEllipse,
  identifier,
  LuaFunctionParam,
  LuaFunctionTypeParam,
  LuaIdentifier,
  LuaType,
  LuaTypeAnnotation,
  makeOptional,
  makeOptionalAnnotation,
  typeAnnotation,
  typeAny,
} from '@js-to-lua/lua-types';
import { applyTo, pipe } from 'ramda';
import { AssignedToConfig } from '../config/assigned-to.config';
import { NoShadowIdentifiersConfig } from '../config/no-shadow-identifiers.config';
import { IdentifierHandlerFunction } from './expression/identifier-handler-types';
import { BabelFunctionTypesParams } from './function-params.types';
import { createRestElementHandler } from './rest-element.handler';
import { inferType } from './type/infer-type';

export const createFunctionTypeParamsHandler = (
  handleIdentifier: IdentifierHandlerFunction,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  const _functionParamsHandler = _createFunctionParamsHandler(
    handleIdentifier,
    handleTypeAnnotation,
    handleType
  );

  return (
    source: string,
    config: AssignedToConfig & NoShadowIdentifiersConfig,
    node: BabelFunctionTypesParams
  ): Array<LuaFunctionTypeParam> => {
    return _functionParamsHandler(source, config, node).map((param) =>
      param.type === 'ParamName'
        ? functionParamName(
            removeIdTypeAnnotation(param.identifier),
            param.identifier.typeAnnotation
              ? param.identifier.typeAnnotation.typeAnnotation
              : typeAny()
          )
        : functionTypeParamEllipse(param.typeAnnotation)
    );
  };
};

export const createFunctionParamsHandler = (
  handleIdentifier: IdentifierHandlerFunction,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  const _functionParamsHandler = _createFunctionParamsHandler(
    handleIdentifier,
    handleTypeAnnotation,
    handleType
  );

  return (
    source: string,
    config: AssignedToConfig & NoShadowIdentifiersConfig,
    node: BabelFunctionTypesParams
  ): Array<LuaFunctionParam> => {
    return _functionParamsHandler(source, config, node).map((param) =>
      param.type === 'ParamName'
        ? param.identifier
        : functionParamEllipse(param.typeAnnotation)
    );
  };
};

type ParamName = {
  type: 'ParamName';
  identifier: LuaIdentifier;
};
type ParamEllipse = { type: 'ParamEllipse'; typeAnnotation: LuaType };
type LuaParam = ParamName | ParamEllipse;

const paramName = (id: LuaIdentifier): ParamName => ({
  type: 'ParamName',
  identifier: id,
});

const paramEllipse = (typeAnnotation: LuaType): ParamEllipse => ({
  type: 'ParamEllipse',
  typeAnnotation,
});

const _createFunctionParamsHandler = (
  handleIdentifier: IdentifierHandlerFunction,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  const restHandler = createRestElementHandler(handleType);

  return (
    source: string,
    config: AssignedToConfig & NoShadowIdentifiersConfig,
    node: BabelFunctionTypesParams
  ): LuaParam[] => {
    const handleAssignmentPatternTypeAnnotation = ({
      left,
    }: Babel.AssignmentPattern): LuaTypeAnnotation =>
      makeOptionalAnnotation(true)(
        left.type === 'MemberExpression' || !left.typeAnnotation
          ? typeAnnotation(inferType(left))
          : handleTypeAnnotation(source, config, left.typeAnnotation)
      );

    const handleArrayOrObjectPatternTypeAnnotation = ({
      typeAnnotation,
    }: Babel.ArrayPattern | Babel.ObjectPattern):
      | LuaTypeAnnotation
      | undefined =>
      typeAnnotation
        ? handleTypeAnnotation(source, config, typeAnnotation)
        : undefined;

    let paramRefIdCount = 0;
    const mapFn = (node: BabelFunctionTypesParams): LuaParam[] =>
      node.params
        .map((param) => {
          if (
            Babel.isArrayPattern(param) ||
            Babel.isObjectPattern(param) ||
            (Babel.isAssignmentPattern(param) &&
              (Babel.isObjectPattern(param.left) ||
                Babel.isArrayPattern(param.left)))
          ) {
            return paramName(
              identifier(
                `ref${'_'.repeat(paramRefIdCount++)}`,
                Babel.isAssignmentPattern(param)
                  ? handleAssignmentPatternTypeAnnotation(param)
                  : handleArrayOrObjectPatternTypeAnnotation(param)
              )
            );
          } else if (Babel.isIdentifier(param)) {
            return paramName(
              handleIdentifier(source, config, param) as LuaIdentifier
            );
          } else if (Babel.isAssignmentPattern(param)) {
            return applyTo(
              handleIdentifier(
                source,
                config,
                param.left as Babel.Identifier
              ) as LuaIdentifier,
              pipe(
                (id: LuaIdentifier) => ({
                  ...id,
                  typeAnnotation: typeAnnotation(
                    makeOptional(
                      id.typeAnnotation?.typeAnnotation ||
                        inferType(param.right)
                    )
                  ),
                }),
                paramName
              )
            );
          } else if (Babel.isTSParameterProperty(param)) {
            return mapFn({
              params: [param.parameter],
            });
          } else {
            return paramEllipse(restHandler(source, config, param));
          }
        })
        .flat();

    const needsSelf = Babel.isMemberExpression(config.assignedTo);
    return applyTo(mapFn(node), (identifiers) =>
      needsSelf
        ? [
            paramName(
              identifier(
                generateUniqueIdentifier(
                  config.noShadowIdentifiers || [],
                  'self',
                  true
                ),
                typeAnnotation(typeAny())
              )
            ),
            ...identifiers,
          ]
        : identifiers
    );
  };
};

import * as Babel from '@babel/types';
import { HandlerFunction } from '@js-to-lua/handler-utils';
import {
  generateUniqueIdentifier,
  removeIdTypeAnnotation,
} from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  functionParamEllipse,
  functionParamName,
  functionTypeParamEllipse,
  identifier,
  LuaDeclaration,
  LuaFunctionParam,
  LuaFunctionTypeParam,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  makeOptional,
  makeOptionalAnnotation,
  nodeGroup,
  tableConstructor,
  tableNoKeyField,
  typeAnnotation,
  typeAny,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { applyTo, pipe } from 'ramda';
import { AssignedToConfig } from '../config/assigned-to.config';
import { NoShadowIdentifiersConfig } from '../config/no-shadow-identifiers.config';
import { IdentifierHandlerFunction } from './expression/identifier-handler-types';
import { BabelFunctionTypesParams } from './function-params.types';
import { createParamRefGenerator } from './param-ref-generator';
import { createRestElementHandler } from './rest-element.handler';
import { inferType } from './type/infer-type';

type ParamsBodyResponse = {
  params: Array<LuaFunctionParam>;
  typeParams: Array<LuaFunctionTypeParam>;
  body: Array<
    LuaNodeGroup | LuaDeclaration | AssignmentStatement | LuaStatement
  >;
};
type ParamsBodyResponse1 = Array<{
  param: LuaFunctionParam;
  typeParam: LuaFunctionTypeParam;
  body?: LuaNodeGroup | LuaDeclaration | AssignmentStatement | LuaStatement;
}>;

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

const paramNameToFunctionParam = (param: LuaParam): LuaFunctionParam =>
  param.type === 'ParamName'
    ? param.identifier
    : functionParamEllipse(param.typeAnnotation);

const paramNameToFunctionTypeParam = (param: LuaParam): LuaFunctionTypeParam =>
  param.type === 'ParamName'
    ? functionParamName(
        removeIdTypeAnnotation(param.identifier),
        param.identifier.typeAnnotation
          ? param.identifier.typeAnnotation.typeAnnotation
          : typeAny()
      )
    : functionTypeParamEllipse(param.typeAnnotation);

const paramNameToFunctionParams = (
  param: LuaParam
): { param: LuaFunctionParam; typeParam: LuaFunctionTypeParam } => ({
  param: paramNameToFunctionParam(param),
  typeParam: paramNameToFunctionTypeParam(param),
});

export const createFunctionParamsWithBodyHandler = (
  handleIdentifier: IdentifierHandlerFunction,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Babel.Declaration
  >,
  handleAssignmentPattern: HandlerFunction<
    AssignmentStatement,
    Babel.AssignmentPattern
  >,
  handleLVal: HandlerFunction<LuaLVal, Babel.LVal>,
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
  ): ParamsBodyResponse => {
    const handleAssignmentPatternTypeAnnotation = ({
      left,
    }: Babel.AssignmentPattern): LuaTypeAnnotation =>
      left.type === 'MemberExpression' || !left.typeAnnotation
        ? typeAnnotation(inferType(left))
        : handleTypeAnnotation(source, config, left.typeAnnotation);

    const handleArrayOrObjectPatternTypeAnnotation = ({
      typeAnnotation,
    }: Babel.ArrayPattern | Babel.ObjectPattern):
      | LuaTypeAnnotation
      | undefined =>
      typeAnnotation
        ? handleTypeAnnotation(source, config, typeAnnotation)
        : undefined;

    const paramRefGenerator = createParamRefGenerator();

    const mapFn = (node: BabelFunctionTypesParams): ParamsBodyResponse1 =>
      node.params
        .map((param) => {
          if (Babel.isAssignmentPattern(param)) {
            if (
              Babel.isArrayPattern(param.left) ||
              Babel.isObjectPattern(param.left)
            ) {
              const refName = paramRefGenerator.next();
              const refId = Babel.identifier(refName);
              const p = paramName(
                identifier(
                  refName + '_',
                  Babel.isAssignmentPattern(param)
                    ? makeOptionalAnnotation(true)(
                        handleAssignmentPatternTypeAnnotation(param)
                      )
                    : handleArrayOrObjectPatternTypeAnnotation(param)
                )
              );
              const body = nodeGroup([
                handleAssignmentPattern(
                  source,
                  {
                    refTypeAnnotation:
                      handleAssignmentPatternTypeAnnotation(param),
                    ...config,
                  },
                  {
                    ...param,
                    left: {
                      ...refId,
                      typeAnnotation: param.left.typeAnnotation,
                    },
                  }
                ),
                handleDeclaration(
                  source,
                  node,
                  Babel.variableDeclaration('let', [
                    Babel.variableDeclarator(param.left, refId),
                  ])
                ),
              ]);
              return {
                ...paramNameToFunctionParams(p),
                body,
              };
            }
            const p = applyTo(
              handleIdentifier(
                source,
                config,
                param.left as Babel.Identifier
              ) as LuaIdentifier,
              pipe(
                (id: LuaIdentifier) => ({
                  ...id,
                  name: id.name + '_',
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
            return {
              ...paramNameToFunctionParams(p),
              body: handleAssignmentPattern(source, config, param),
            };
          } else if (
            Babel.isArrayPattern(param) ||
            Babel.isObjectPattern(param)
          ) {
            const refName = paramRefGenerator.next();
            const refId = Babel.identifier(refName);
            const p = paramName(
              identifier(
                refName,
                Babel.isAssignmentPattern(param)
                  ? makeOptionalAnnotation(true)(
                      handleAssignmentPatternTypeAnnotation(param)
                    )
                  : handleArrayOrObjectPatternTypeAnnotation(param)
              )
            );
            return {
              ...paramNameToFunctionParams(p),
              body: handleDeclaration(
                source,
                node,
                Babel.variableDeclaration('let', [
                  Babel.variableDeclarator(param, refId),
                ])
              ),
            };
          } else if (Babel.isIdentifier(param)) {
            const p = paramName(
              handleIdentifier(source, config, param) as LuaIdentifier
            );
            return { ...paramNameToFunctionParams(p) };
          } else if (Babel.isTSParameterProperty(param)) {
            return mapFn({
              params: [param.parameter],
            });
          } else {
            const p = paramEllipse(restHandler(source, config, param));
            const body = variableDeclaration(
              [
                variableDeclaratorIdentifier(
                  handleLVal(source, config, param.argument)
                ),
              ],
              [
                variableDeclaratorValue(
                  tableConstructor([tableNoKeyField(identifier('...'))])
                ),
              ]
            );
            return { ...paramNameToFunctionParams(p), body };
          }
        })
        .flat();

    const needsSelf = Babel.isMemberExpression(config.assignedTo);
    const response = applyTo(
      mapFn(node),
      (res): ParamsBodyResponse1 =>
        needsSelf
          ? [
              paramNameToFunctionParams(
                paramName(
                  identifier(
                    generateUniqueIdentifier(
                      config.noShadowIdentifiers || [],
                      'self',
                      true
                    ),
                    typeAnnotation(typeAny())
                  )
                )
              ),
              ...res,
            ]
          : res
    );

    return {
      params: response.map(({ param }) => param),
      typeParams: response.map(({ typeParam }) => typeParam),
      body: response.map(({ body }) => body).filter(isTruthy),
    };
  };
};

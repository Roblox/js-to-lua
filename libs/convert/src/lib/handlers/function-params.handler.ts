import {
  ArrayPattern,
  ArrowFunctionExpression,
  AssignmentPattern,
  ClassMethod,
  ClassPrivateMethod,
  Declaration,
  FlowType,
  FunctionDeclaration,
  FunctionExpression,
  identifier as babelIdentifier,
  Identifier,
  isArrayPattern,
  isAssignmentPattern,
  isIdentifier,
  isObjectPattern,
  isRestElement,
  isTSParameterProperty,
  LVal,
  Noop,
  ObjectMethod,
  ObjectPattern,
  TSDeclareMethod,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultStatementHandler } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  identifier,
  LuaBinaryExpression,
  LuaDeclaration,
  LuaFunctionParam,
  LuaIdentifier,
  LuaLVal,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaNodeGroup,
  LuaType,
  LuaTypeAnnotation,
  makeOptional,
  makeOptionalAnnotation,
  nodeGroup,
  tableConstructor,
  tableNoKeyField,
  typeAnnotation,
  UnhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { anyPass, applyTo } from 'ramda';
import { createRestElementHandler } from './rest-element.handler';
import { inferType } from './type/infer-type';

type FunctionTypes =
  | ArrowFunctionExpression
  | FunctionExpression
  | FunctionDeclaration
  | ObjectMethod
  | ClassMethod
  | ClassPrivateMethod
  | TSDeclareMethod;

export const createFunctionParamsHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >,
  handleType: HandlerFunction<LuaType, FlowType | TSType>
): ((
  source: string,
  config: EmptyConfig,
  node: FunctionTypes
) => LuaIdentifier[]) => {
  const restHandler = createRestElementHandler(handleType);
  return (
    source: string,
    config: EmptyConfig,
    node: FunctionTypes
  ): LuaIdentifier[] => {
    const handleAssignmentPatternTypeAnnotation = ({
      left,
    }: AssignmentPattern): LuaTypeAnnotation =>
      makeOptionalAnnotation(true)(
        left.type === 'MemberExpression' || !left.typeAnnotation
          ? typeAnnotation(inferType(left))
          : handleTypeAnnotation(source, config, left.typeAnnotation)
      );

    const handleArrayOrObjectPatternTypeAnnotation = ({
      typeAnnotation,
    }: ArrayPattern | ObjectPattern): LuaTypeAnnotation | undefined =>
      typeAnnotation
        ? handleTypeAnnotation(source, config, typeAnnotation)
        : undefined;

    let paramRefIdCount = 0;
    const mapFn = (node: FunctionTypes): LuaIdentifier[] =>
      node.params
        .map((param) => {
          if (
            isArrayPattern(param) ||
            isObjectPattern(param) ||
            (isAssignmentPattern(param) &&
              (isObjectPattern(param.left) || isArrayPattern(param.left)))
          ) {
            return identifier(
              `ref${'_'.repeat(paramRefIdCount++)}`,
              isAssignmentPattern(param)
                ? handleAssignmentPatternTypeAnnotation(param)
                : handleArrayOrObjectPatternTypeAnnotation(param)
            );
          } else if (isIdentifier(param)) {
            return handleIdentifier(source, config, param) as LuaFunctionParam;
          } else if (isAssignmentPattern(param)) {
            return applyTo(
              handleIdentifier(
                source,
                config,
                param.left as Identifier
              ) as LuaIdentifier,
              (id) => ({
                ...id,
                typeAnnotation: typeAnnotation(
                  makeOptional(
                    id.typeAnnotation?.typeAnnotation || inferType(param.right)
                  )
                ),
              })
            );
          } else if (isTSParameterProperty(param)) {
            return mapFn({
              params: [param.parameter],
            } as FunctionTypes);
          } else {
            return identifier(
              '...',
              typeAnnotation(restHandler(source, config, param))
            );
          }
        })
        .flat();
    return mapFn(node);
  };
};

type ParamsBodyResponse = Array<
  LuaNodeGroup | LuaDeclaration | AssignmentStatement | UnhandledStatement
>;

export const createFunctionParamsBodyHandler = (
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  >,
  handleAssignmentPattern: HandlerFunction<
    AssignmentStatement,
    AssignmentPattern
  >,
  handleLVal: HandlerFunction<LuaLVal, LVal>
): ((
  source: string,
  config: EmptyConfig,
  node: FunctionTypes
) => ParamsBodyResponse) => {
  const handler: (
    source: string,
    config: EmptyConfig,
    node: FunctionTypes
  ) => ParamsBodyResponse = (
    source: string,
    config: EmptyConfig,
    node: FunctionTypes
  ) => {
    let destructuringRefIdCount = 0;

    const mapFn = (node: FunctionTypes): ParamsBodyResponse =>
      node.params
        .filter((param) =>
          anyPass([
            isAssignmentPattern,
            isObjectPattern,
            isArrayPattern,
            isTSParameterProperty,
            isRestElement,
          ])(param, undefined)
        )
        .map((param) => {
          if (isAssignmentPattern(param)) {
            if (isArrayPattern(param.left) || isObjectPattern(param.left)) {
              return nodeGroup([
                handleAssignmentPattern(source, config, {
                  ...param,
                  left: babelIdentifier(
                    `ref${'_'.repeat(destructuringRefIdCount)}`
                  ),
                  right: { ...param.right },
                }),
                handleDeclaration(
                  source,
                  node,
                  babelVariableDeclaration('let', [
                    babelVariableDeclarator(
                      param.left,
                      babelIdentifier(
                        `ref${'_'.repeat(destructuringRefIdCount++)}`
                      )
                    ),
                  ])
                ),
              ]);
            }
            return handleAssignmentPattern(source, config, param);
          } else if (isArrayPattern(param)) {
            return handleDeclaration(
              source,
              node,
              babelVariableDeclaration('let', [
                babelVariableDeclarator(
                  param,
                  babelIdentifier(`ref${'_'.repeat(destructuringRefIdCount++)}`)
                ),
              ])
            );
          } else if (isObjectPattern(param)) {
            return handleDeclaration(
              source,
              node,
              babelVariableDeclaration('let', [
                babelVariableDeclarator(
                  param,
                  babelIdentifier(`ref${'_'.repeat(destructuringRefIdCount++)}`)
                ),
              ])
            );
          } else if (isTSParameterProperty(param)) {
            return mapFn({
              params: [param.parameter],
            } as FunctionTypes);
          } else if (isRestElement(param)) {
            return variableDeclaration(
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
          } else {
            return defaultStatementHandler(source, config, param);
          }
        })
        .flat();

    return mapFn(node);
  };
  return handler;
};

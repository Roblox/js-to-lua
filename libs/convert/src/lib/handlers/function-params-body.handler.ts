import * as Babel from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultStatementHandler } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  identifier,
  LuaDeclaration,
  LuaLVal,
  LuaNodeGroup,
  nodeGroup,
  tableConstructor,
  tableNoKeyField,
  UnhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { anyPass } from 'ramda';
import { BabelFunctionTypesParams } from './function-params.types';

type ParamsBodyResponse = Array<
  LuaNodeGroup | LuaDeclaration | AssignmentStatement | UnhandledStatement
>;

export const createFunctionParamsBodyHandler =
  (
    handleDeclaration: HandlerFunction<
      LuaNodeGroup | LuaDeclaration,
      Babel.Declaration
    >,
    handleAssignmentPattern: HandlerFunction<
      AssignmentStatement,
      Babel.AssignmentPattern
    >,
    handleLVal: HandlerFunction<LuaLVal, Babel.LVal>
  ) =>
  (
    source: string,
    config: EmptyConfig,
    node: BabelFunctionTypesParams
  ): ParamsBodyResponse => {
    let destructuringRefIdCount = 0;

    const mapFn = (node: BabelFunctionTypesParams): ParamsBodyResponse =>
      node.params
        .filter((param) =>
          anyPass([
            Babel.isAssignmentPattern,
            Babel.isObjectPattern,
            Babel.isArrayPattern,
            Babel.isTSParameterProperty,
            Babel.isRestElement,
          ])(param, undefined)
        )
        .map((param) => {
          if (Babel.isAssignmentPattern(param)) {
            if (
              Babel.isArrayPattern(param.left) ||
              Babel.isObjectPattern(param.left)
            ) {
              const refId = Babel.identifier(
                `ref${'_'.repeat(destructuringRefIdCount++)}`
              );
              return nodeGroup([
                handleAssignmentPattern(source, config, {
                  ...param,
                  left: refId,
                  right: { ...param.right },
                }),
                handleDeclaration(
                  source,
                  node,
                  Babel.variableDeclaration('let', [
                    Babel.variableDeclarator(param.left, refId),
                  ])
                ),
              ]);
            }
            return handleAssignmentPattern(source, config, param);
          } else if (
            Babel.isArrayPattern(param) ||
            Babel.isObjectPattern(param)
          ) {
            const refId = Babel.identifier(
              `ref${'_'.repeat(destructuringRefIdCount++)}`
            );
            return handleDeclaration(
              source,
              node,
              Babel.variableDeclaration('let', [
                Babel.variableDeclarator(param, refId),
              ])
            );
          } else if (Babel.isTSParameterProperty(param)) {
            return mapFn({
              params: [param.parameter],
            });
          } else if (Babel.isRestElement(param)) {
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

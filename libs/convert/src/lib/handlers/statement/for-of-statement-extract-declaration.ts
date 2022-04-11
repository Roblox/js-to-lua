import {
  Expression,
  isIdentifier as isBabelIdentifier,
  LVal,
  ObjectMethod,
  ObjectProperty,
  Statement,
  VariableDeclaration as BabelVariableDeclaration,
} from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultUnhandledIdentifierHandlerWithComment } from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaStatement,
  LuaTableKeyField,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { IdentifierStrictHandlerFunction } from '../expression/identifier-handler-types';
import { createExtractForOfAssignmentStatement } from './for-of-statement-extract-statement';

export const createExtractForOfDeclaration = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >
) => {
  return (
    source: string,
    config: EmptyConfig,
    { declarations }: BabelVariableDeclaration
  ): { identifiers: LuaIdentifier[]; statements: LuaStatement[] } => {
    const results = declarations.map(
      ({ id }): { identifier: LuaIdentifier; statement?: LuaStatement } => {
        const extracted = createExtractForOfAssignmentStatement(
          handleIdentifierStrict,
          handleExpression,
          handleStatement,
          handleLVal,
          handleObjectField
        )(source, config, id, true);

        return isBabelIdentifier(id)
          ? { identifier: handleIdentifierStrict(source, config, id) }
          : extracted
          ? {
              identifier: extracted.identifier,
              statement: extracted.statement,
            }
          : {
              identifier: defaultUnhandledIdentifierHandlerWithComment(
                `ROBLOX TODO: Unhandled node for type: ${id.type} within ForOfStatement left expression`
              )(source, config, id),
            };
      }
    );
    return {
      identifiers: results.map(({ identifier }) => identifier),
      statements: results.map(({ statement }) => statement).filter(isTruthy),
    };
  };
};

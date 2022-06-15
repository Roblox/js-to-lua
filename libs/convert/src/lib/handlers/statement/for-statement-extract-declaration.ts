import * as Babel from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultUnhandledIdentifierHandlerWithComment } from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaStatement,
  LuaTableKeyField,
} from '@js-to-lua/lua-types';
import { Override } from '@js-to-lua/shared-utils';
import { IdentifierStrictHandlerFunction } from '../expression/identifier-handler-types';
import { createExtractForOfAssignmentStatement } from './for-of-statement-extract-statement';

export const createExtractForStatementDeclaration = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleLVal: HandlerFunction<LuaLVal, Babel.LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    Babel.ObjectMethod | Babel.ObjectProperty
  >
) => {
  return (
    source: string,
    config: EmptyConfig,
    forStatement: Override<
      Babel.ForOfStatement | Babel.ForInStatement,
      {
        left: Override<
          Babel.VariableDeclaration,
          {
            declarations: [Babel.VariableDeclarator];
          }
        >;
      }
    >
  ): { id: LuaIdentifier; statements: LuaStatement[] } => {
    const {
      left: { declarations },
    } = forStatement;
    const [{ id }] = declarations;

    const extracted = createExtractForOfAssignmentStatement(
      handleIdentifierStrict,
      handleExpression,
      handleStatement,
      handleLVal,
      handleObjectField
    )(source, config, id, true);

    return Babel.isIdentifier(id)
      ? {
          id: handleIdentifierStrict(source, config, id),
          statements: [],
        }
      : extracted
      ? {
          id: extracted.identifier,
          statements: [extracted.statement],
        }
      : {
          id: defaultUnhandledIdentifierHandlerWithComment(
            `ROBLOX TODO: Unhandled node for type: ${id.type} within ${forStatement.type} left expression`
          )(source, config, id),
          statements: [],
        };
  };
};

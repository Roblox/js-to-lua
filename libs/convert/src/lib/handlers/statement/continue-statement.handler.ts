import { ContinueStatement } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import {
  continueStatement,
  LuaStatement,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { ContinueStatementHandlerConfig } from './continue-statement-handler-config';

export const createContinueStatementHandler = () =>
  createHandler<
    LuaStatement,
    ContinueStatement,
    ContinueStatementHandlerConfig
  >('ContinueStatement', (source, { continueUpdateStatements }) =>
    continueUpdateStatements && continueUpdateStatements.length
      ? nodeGroup([...continueUpdateStatements, continueStatement()])
      : continueStatement()
  );

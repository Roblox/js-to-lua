import * as Babel from '@babel/types';
import {
  asStatementReturnTypeInline,
  BaseNodeHandler,
  createAsStatementHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  AssignmentStatement,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
  LuaType,
  LuaTypeAnnotation,
  tableConstructor,
} from '@js-to-lua/lua-types';
import { IdentifierHandlerFunction } from '../../identifier-handler-types';
import { createObjectMethodHandler } from '../object-method.handler';

export const createObjectMethodAsStatementHandler = (
  handleExpression: BaseNodeHandler<LuaExpression, Babel.Expression>,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleIdentifier: IdentifierHandlerFunction,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Exclude<Babel.ExportDefaultDeclaration['declaration'], Babel.Expression>
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
  return createAsStatementHandler<
    LuaStatement,
    Babel.ObjectMethod,
    LuaTableConstructor<[LuaTableKeyField]>
  >('ObjectMethod', (source, config, node) => {
    const objectMethodField = createObjectMethodHandler(
      handleExpression,
      handleStatement,
      handleIdentifier,
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal,
      handleTypeAnnotation,
      handleType
    ).handler(source, config, node);

    return asStatementReturnTypeInline(
      [],
      tableConstructor([objectMethodField]),
      []
    );
  });
};

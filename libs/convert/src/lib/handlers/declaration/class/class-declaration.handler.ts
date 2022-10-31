import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  combineOptionalHandlerFunctions,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  ClassDeclarationBody,
  defaultExpressionHandler,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  nodeGroup,
  typeAliasDeclaration,
  typeReference,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createClassDeclarationDefaultHandler } from './cases/default/class-declaration-default.handler';
import { createHandleReactClassDeclaration } from './cases/react/react-class-declaration.handler';

export const createClassDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >,
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Babel.Declaration
  >,
  handleLVal: HandlerFunction<LuaLVal, Babel.LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) =>
  createHandler<LuaNodeGroup<ClassDeclarationBody>, Babel.ClassDeclaration>(
    'ClassDeclaration',
    (source, config, node): LuaNodeGroup<ClassDeclarationBody> => {
      const handleSpecialCases = combineOptionalHandlerFunctions([
        createHandleReactClassDeclaration(
          handleExpression,
          handleExpressionAsStatement,
          handleIdentifierStrict,
          handleStatement,
          handleDeclaration,
          handleLVal,
          handleTypeAnnotation,
          handleType
        ),
        createClassDeclarationDefaultHandler(
          handleExpression,
          handleExpressionAsStatement,
          handleIdentifierStrict,
          handleStatement,
          handleDeclaration,
          handleLVal,
          handleTypeAnnotation,
          handleType
        ),
      ]);

      const handled = handleSpecialCases(source, config, node);

      if (handled) {
        return handled;
      }

      const defaultExpression = defaultExpressionHandler(source, config, node);
      const classIdentifier = handleIdentifierStrict(source, config, node.id);
      return nodeGroup([
        typeAliasDeclaration(
          classIdentifier,
          typeReference(identifier('unknown'))
        ),
        nodeGroup([]),
        variableDeclaration(
          [variableDeclaratorIdentifier(classIdentifier)],
          [variableDeclaratorValue(defaultExpression)]
        ),
      ]);
    }
  );

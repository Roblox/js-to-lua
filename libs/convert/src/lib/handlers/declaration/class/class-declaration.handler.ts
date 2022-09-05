import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  ClassDeclarationBody,
  withClassDeclarationExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createConstructorHandlerFunction } from './class-declaration-constructor.handler';
import { createClassMethodsHandlerFunction } from './class-declaration-methods.handler';
import { createStaticPropsHandlerFunction } from './class-declaration-static-properties.handler';
import { createHandleClassTypePrivateAlias } from './class-declaration-type-private.handler';
import { createHandleClassTypeStaticsAlias } from './class-declaration-type-statics.handler';
import { createHandleClassTypeAlias } from './class-declaration-type.handler';
import { createClassVariableDeclarationHandlerFunction } from './class-declaration-variable-declaration.handler';

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
    (source, config, node) => {
      const classIdentifier = handleIdentifierStrict(source, config, node.id);

      const handleStaticProps = createStaticPropsHandlerFunction(
        handleExpression
      )(source, { ...config, classIdentifier });

      const handleConstructor = createConstructorHandlerFunction(
        handleExpression,
        handleExpressionAsStatement,
        handleIdentifierStrict,
        handleStatement,
        handleDeclaration,
        handleLVal,
        handleTypeAnnotation,
        handleType
      )(source, {
        ...config,
        classIdentifier,
      });

      const toClassVariableDeclaration =
        createClassVariableDeclarationHandlerFunction(
          handleExpression,
          handleType
        )(source, {
          ...config,
          classIdentifier,
        });

      const handleClassMethods = createClassMethodsHandlerFunction(
        handleExpression,
        handleExpressionAsStatement,
        handleIdentifierStrict,
        handleStatement,
        handleDeclaration,
        handleLVal,
        handleTypeAnnotation,
        handleType
      )(source, {
        ...config,
        classIdentifier,
      });

      const handleClassTypeAlias = createHandleClassTypeAlias(
        handleExpression,
        handleIdentifierStrict,
        handleTypeAnnotation,
        handleType
      )(source, { ...config, classIdentifier });

      const handleClassTypePrivateAlias = createHandleClassTypePrivateAlias(
        handleExpression,
        handleIdentifierStrict,
        handleTypeAnnotation,
        handleType
      )(source, { ...config, classIdentifier });

      const handleClassTypeStaticsAlias = createHandleClassTypeStaticsAlias(
        handleExpression,
        handleIdentifierStrict,
        handleTypeAnnotation,
        handleType
      )(source, { ...config, classIdentifier });

      const classTypeAlias = handleClassTypeAlias(node);
      const classTypePrivateAlias = handleClassTypePrivateAlias(node);
      const classTypeStaticsAlias = handleClassTypeStaticsAlias(node);
      return withClassDeclarationExtra(
        nodeGroup([
          classTypeAlias,
          nodeGroup(
            [classTypePrivateAlias, classTypeStaticsAlias].filter(isTruthy)
          ),
          ...toClassVariableDeclaration(node).body,
          ...handleStaticProps(node).body,
          handleConstructor(node),
          ...handleClassMethods(node).body,
        ])
      );
    }
  );

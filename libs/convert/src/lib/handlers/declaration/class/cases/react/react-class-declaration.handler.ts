import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  createOptionalHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  ClassDeclarationBody,
  withClassDeclarationExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaDeclaration,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { IdentifierStrictHandlerFunction } from '../../../../expression/identifier-handler-types';
import { isReactComponentExtendedClass } from '../../class-declaration.utils';
import { createStaticPropsHandlerFunction } from '../class-declaration-static-properties.handler';
import { createReactConstructorHandlerFunction } from './react-class-declaration-constructor.handler';
import { createReactClassMethodsHandlerFunction } from './react-class-declaration-methods.handler';
import { createReactHandleClassTypePrivateAlias } from './react-class-declaration-type-private.handler';
import { createReactHandleClassTypeStaticsAlias } from './react-class-declaration-type-statics.handler';
import { createHandleReactClassTypeAlias } from './react-class-declaration-type.handler';
import { createReactClassVariableDeclarationHandlerFunction } from './react-class-declaration-variable-declaration.handler';

export const createHandleReactClassDeclaration = (
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
) => {
  return createOptionalHandlerFunction<
    LuaNodeGroup<ClassDeclarationBody>,
    Babel.ClassDeclaration
  >((source, config, node) => {
    if (!isReactComponentExtendedClass(node)) {
      return undefined;
    }

    const classIdentifier = handleIdentifierStrict(source, config, node.id);

    const {
      handleStaticProps,
      handleConstructor,
      handleClassVariableDeclaration,
      handleClassMethods,
      handleClassTypeAlias,
      handleClassTypePrivateAlias,
      handleClassTypeStaticsAlias,
    } = getHandlers(source, {
      ...config,
      classIdentifier,
    });

    const classTypeAlias = handleClassTypeAlias(node);
    const classTypePrivateAlias = handleClassTypePrivateAlias(node);
    const classTypeStaticsAlias = handleClassTypeStaticsAlias(node);

    return withClassDeclarationExtra(
      nodeGroup([
        classTypeAlias,
        nodeGroup(
          [classTypePrivateAlias, classTypeStaticsAlias].filter(isTruthy)
        ),
        ...handleClassVariableDeclaration(node).body,
        ...handleStaticProps(node).body,
        handleConstructor(node),
        ...handleClassMethods(node).body,
      ])
    );
  });

  function getHandlers(
    source: string,
    config: EmptyConfig & {
      classIdentifier: LuaIdentifier;
    }
  ) {
    return {
      handleStaticProps: createStaticPropsHandlerFunction(handleExpression)(
        source,
        config
      ),
      handleConstructor: createReactConstructorHandlerFunction(
        handleExpression,
        handleExpressionAsStatement,
        handleIdentifierStrict,
        handleStatement,
        handleDeclaration,
        handleLVal,
        handleTypeAnnotation,
        handleType
      )(source, config),
      handleClassVariableDeclaration:
        createReactClassVariableDeclarationHandlerFunction(
          handleExpression,
          handleType
        )(source, config),
      handleClassMethods: createReactClassMethodsHandlerFunction(
        handleExpression,
        handleExpressionAsStatement,
        handleIdentifierStrict,
        handleStatement,
        handleDeclaration,
        handleLVal,
        handleTypeAnnotation,
        handleType
      )(source, config),
      handleClassTypeAlias: createHandleReactClassTypeAlias(
        handleExpression,
        handleIdentifierStrict,
        handleTypeAnnotation,
        handleType
      )(source, config),
      handleClassTypePrivateAlias: createReactHandleClassTypePrivateAlias(
        handleExpression,
        handleIdentifierStrict,
        handleTypeAnnotation,
        handleType
      )(source, config),
      handleClassTypeStaticsAlias: createReactHandleClassTypeStaticsAlias()(
        source,
        config
      ),
    };
  }
};

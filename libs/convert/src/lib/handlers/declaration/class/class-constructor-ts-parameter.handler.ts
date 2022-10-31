import * as Babel from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  removeTypeAnnotation,
  selfIdentifier,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  LuaLVal,
  memberExpression,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { curry } from 'ramda';

export const createConstructorTsParameterPropHandler = (
  handleIdentifier: HandlerFunction<LuaLVal, Babel.LVal>
) => {
  return curry(
    (source: string, config: EmptyConfig, node: Babel.TSParameterProperty) => {
      if (Babel.isIdentifier(node.parameter)) {
        return assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [
            memberExpression(
              selfIdentifier(),
              '.',
              handleIdentifier(
                source,
                config,
                removeTypeAnnotation(node.parameter)
              )
            ),
          ],
          [
            handleIdentifier(
              source,
              config,
              removeTypeAnnotation(node.parameter)
            ),
          ]
        );
      }

      if (Babel.isIdentifier(node.parameter.left)) {
        return assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [
            memberExpression(
              selfIdentifier(),
              '.',
              handleIdentifier(
                source,
                config,
                removeTypeAnnotation(node.parameter.left)
              )
            ),
          ],
          [
            handleIdentifier(
              source,
              config,
              removeTypeAnnotation(node.parameter.left)
            ),
          ]
        );
      }
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX comment: unhandled parameter type ${node.parameter.type} and left value of type ${node.parameter.left.type}`,
        getNodeSource(source, node.parameter)
      );
    }
  );
};

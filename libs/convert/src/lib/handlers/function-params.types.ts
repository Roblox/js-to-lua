import * as Babel from '@babel/types';

type BabelFunctionTypes =
  | Babel.ArrowFunctionExpression
  | Babel.FunctionExpression
  | Babel.FunctionDeclaration
  | Babel.ObjectMethod
  | Babel.ClassMethod
  | Babel.ClassPrivateMethod
  | Babel.TSDeclareMethod;

export type BabelFunctionTypesParams = Pick<BabelFunctionTypes, 'params'>;

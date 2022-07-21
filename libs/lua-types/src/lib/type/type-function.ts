import { Unpacked } from '@js-to-lua/shared-utils';
import { LuaIdentifier } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from './type';
import {
  functionReturnType,
  LuaFunctionReturnType,
} from './type-function-return-type';
import { LuaTypeParameterDeclaration } from './type-parameter-declaration';

export interface LuaTypeFunction extends BaseLuaNode {
  type: 'LuaTypeFunction';
  typeParameters?: LuaTypeParameterDeclaration;
  parameters: Array<LuaFunctionTypeParam>;
  rest?: LuaType;
  returnType: LuaFunctionReturnType;
}

export const typeFunction = (
  parameters: LuaTypeFunction['parameters'],
  returnType: Unpacked<LuaTypeFunction['returnType']['returnTypes']>,
  typeParameters?: LuaTypeParameterDeclaration
): LuaTypeFunction => ({
  type: 'LuaTypeFunction',
  parameters,
  returnType: functionReturnType([returnType]),
  typeParameters,
});

export const typeFunctionMultipleReturn = (
  parameters: LuaTypeFunction['parameters'],
  returnType: LuaTypeFunction['returnType'],
  typeParameters?: LuaTypeParameterDeclaration
): LuaTypeFunction => ({
  type: 'LuaTypeFunction',
  parameters,
  returnType: returnType,
  typeParameters,
});

export const typeVariadicFunction = (
  parameters: LuaTypeFunction['parameters'],
  rest: NonNullable<LuaTypeFunction['rest']>,
  returnType: Unpacked<LuaTypeFunction['returnType']['returnTypes']>,
  typeParameters?: LuaTypeParameterDeclaration | undefined
): LuaTypeFunction => ({
  type: 'LuaTypeFunction',
  parameters,
  rest,
  returnType: functionReturnType([returnType]),
  typeParameters,
});

export const typeVariadicFunctionMultipleReturn = (
  parameters: LuaTypeFunction['parameters'],
  rest: LuaTypeFunction['rest'],
  returnType: LuaTypeFunction['returnType'],
  typeParameters?: LuaTypeParameterDeclaration | undefined
): LuaTypeFunction => ({
  type: 'LuaTypeFunction',
  parameters,
  rest,
  returnType,
  typeParameters,
});

export const isTypeFunction = isNodeType<LuaTypeFunction>('LuaTypeFunction');

// ----------

export interface LuaFunctionTypeParam extends BaseLuaNode {
  type: 'LuaFunctionTypeParam';
  name: LuaIdentifier | null;
  typeAnnotation: LuaType;
}

export const functionTypeParam = (
  name: LuaFunctionTypeParam['name'],
  typeAnnotation: LuaFunctionTypeParam['typeAnnotation']
): LuaFunctionTypeParam => ({
  type: 'LuaFunctionTypeParam',
  name: name && { ...name, typeAnnotation: undefined },
  typeAnnotation,
});

export const isFunctionTypeParam = isNodeType<LuaFunctionTypeParam>(
  'LuaFunctionTypeParam'
);

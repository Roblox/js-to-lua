import { LuaTypeAnnotation, LuaTypeParameterDeclaration } from '.';
import { LuaIdentifier } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from './type';

export interface LuaTypeFunction extends BaseLuaNode {
  type: 'LuaTypeFunction';
  typeParameters?: LuaTypeParameterDeclaration;
  parameters: Array<LuaFunctionTypeParam>;
  rest?: LuaType;
  returnType: LuaType | LuaTypeAnnotation;
}

export const typeFunction = (
  parameters: LuaTypeFunction['parameters'],
  returnType: LuaTypeFunction['returnType'],
  typeParameters?: LuaTypeParameterDeclaration
): LuaTypeFunction => ({
  type: 'LuaTypeFunction',
  parameters,
  returnType,
  typeParameters,
});

export const typeVariadicFunction = (
  parameters: LuaTypeFunction['parameters'],
  rest: NonNullable<LuaTypeFunction['rest']>,
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

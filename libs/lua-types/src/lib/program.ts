import { BaseLuaNode, isNodeType } from './node.types';
import { LuaStatement } from './statement';

export interface LuaProgram extends BaseLuaNode {
  type: 'Program';
  body: LuaStatement[];
}

export const program = (body: LuaProgram['body'] = []): LuaProgram => ({
  type: 'Program',
  body,
});

export const isProgram = isNodeType<LuaProgram>('Program');

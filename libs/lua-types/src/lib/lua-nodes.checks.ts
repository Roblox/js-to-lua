import {
  LuaBinaryExpression,
  LuaCallExpression,
  LuaElseClause,
  LuaElseifClause,
  LuaFunctionDeclaration,
  LuaFunctionExpression,
  LuaIfClause,
  LuaIndexExpression,
  LuaLogicalExpression,
  LuaMemberExpression,
  LuaProgram,
  LuaReturnStatement,
  LuaUnaryDeleteExpression,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  LuaVariableDeclaration,
  UnhandledExpression,
  UnhandledStatement,
} from './lua-nodes.types';
import { isNodeType } from './node.types';

export const isProgram = isNodeType<LuaProgram>('Program');

export const isCallExpression = isNodeType<LuaCallExpression>('CallExpression');
export const isBinaryExpression = isNodeType<LuaBinaryExpression>(
  'LuaBinaryExpression'
);
export const isLogicalExpression = isNodeType<LuaLogicalExpression>(
  'LogicalExpression'
);
export const isFunctionExpression = isNodeType<LuaFunctionExpression>(
  'FunctionExpression'
);
export const isReturnStatement = isNodeType<LuaReturnStatement>(
  'ReturnStatement'
);
export const isUnaryExpression = isNodeType<LuaUnaryExpression>(
  'LuaUnaryExpression'
);
export const isUnaryVoidExpression = isNodeType<LuaUnaryVoidExpression>(
  'LuaUnaryVoidExpression'
);
export const isUnaryNegation = isNodeType<LuaUnaryNegationExpression>(
  'LuaUnaryNegationExpression'
);
export const isIndexExpression = isNodeType<LuaIndexExpression>(
  'IndexExpression'
);
export const isMemberExpression = isNodeType<LuaMemberExpression>(
  'LuaMemberExpression'
);
export const isUnaryDeleteExpression = isNodeType<LuaUnaryDeleteExpression>(
  'LuaUnaryDeleteExpression'
);

export const isIfClause = isNodeType<LuaIfClause>('IfClause');

export const isElseifClause = isNodeType<LuaElseifClause>('ElseifClause');

export const isElseClause = isNodeType<LuaElseClause>('ElseClause');

export const isFunctionDeclaration = isNodeType<LuaFunctionDeclaration>(
  'FunctionDeclaration'
);

export const isVariableDeclaration = isNodeType<LuaVariableDeclaration>(
  'VariableDeclaration'
);

export const isUnhandledExpression = isNodeType<UnhandledExpression>(
  'UnhandledExpression'
);

export const isUnhandledStatement = isNodeType<UnhandledStatement>(
  'UnhandledStatement'
);

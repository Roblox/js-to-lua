export type LuaNode =
  | LuaProgram
  | LuaExpressionStatement
  | LuaNumericLiteral
  | LuaStringLiteral
  | LuaMultilineStringLiteral
  | LuaBooleanLiteral
  | LuaTableConstructor
  | LuaTableField
  | LuaIdentifier
  | LuaNilLiteral
  | LuaCallExpression
  | LuaVariableDeclaration
  | LuaNodeGroup
  | LuaVariableDeclarator
  | LuaVariableDeclaratorIdentifier
  | LuaVariableDeclaratorValue
  | LuaFunctionDeclaration
  | LuaTypeAnnotation
  | LuaType
  | LuaTypeAliasDeclaration
  | LuaPropertySignature
  | LuaBinaryExpression
  | LuaBlockStatement
  | LuaFunctionExpression
  | LuaReturnStatement
  | LuaUnaryExpression
  | LuaUnaryVoidExpression
  | LuaUnaryNegationExpression
  | LuaUnaryDeleteExpression
  | LuaIndexExpression
  | LuaMemberExpression
  | UnhandledNode;

export interface BaseLuaNode {
  type: string;
  conversionComment?: string;
}

export type LuaLiteral =
  | LuaNumericLiteral
  | LuaStringLiteral
  | LuaMultilineStringLiteral
  | LuaBooleanLiteral
  | LuaNilLiteral;

export type LuaExpression =
  | LuaLiteral
  | LuaTableConstructor
  | LuaIdentifier
  | LuaCallExpression
  | LuaBinaryExpression
  | LuaFunctionExpression
  | LuaReturnStatement
  | LuaUnaryExpression
  | LuaUnaryVoidExpression
  | LuaUnaryNegationExpression
  | LuaIndexExpression
  | LuaMemberExpression
  | LuaUnaryDeleteExpression
  | UnhandledNode;

export type LuaDeclaration =
  | LuaFunctionDeclaration
  | LuaVariableDeclaration
  | LuaTypeAliasDeclaration;

export interface LuaExpressionStatement extends BaseLuaNode {
  type: 'ExpressionStatement';
  expression: LuaExpression;
}

export interface LuaCallExpression extends BaseLuaNode {
  type: 'CallExpression';
  callee: LuaExpression;
  arguments: LuaExpression[];
}

export interface LuaNumericLiteral extends BaseLuaNode {
  type: 'NumericLiteral';
  value: number;
  extra?: {
    raw?: string;
  };
}

export interface LuaStringLiteral extends BaseLuaNode {
  type: 'StringLiteral';
  value: string;
}

export interface LuaMultilineStringLiteral extends BaseLuaNode {
  type: 'MultilineStringLiteral';
  value: string;
}

export interface LuaBooleanLiteral extends BaseLuaNode {
  type: 'BooleanLiteral';
  value: boolean;
}

export interface LuaNilLiteral extends BaseLuaNode {
  type: 'NilLiteral';
}

export interface LuaTableNoKeyField extends BaseLuaNode {
  type: 'TableNoKeyField';
  value: LuaExpression;
}

export interface LuaTableExpressionKeyField extends BaseLuaNode {
  type: 'TableExpressionKeyField';
  key: LuaExpression;
  value: LuaExpression;
}

export interface LuaTableNameKeyField extends BaseLuaNode {
  type: 'TableNameKeyField';
  key: LuaIdentifier;
  value: LuaExpression;
}

export type LuaTableKeyField =
  | LuaTableNameKeyField
  | LuaTableExpressionKeyField;

export type LuaTableField =
  | LuaTableNoKeyField
  | LuaTableNameKeyField
  | LuaTableExpressionKeyField;

export interface LuaTableConstructor extends BaseLuaNode {
  type: 'TableConstructor';
  elements: LuaTableField[];
}

export interface UnhandledNode extends BaseLuaNode {
  type: 'UnhandledNode';
  start: number | null;
  end: number | null;
}

export interface LuaProgram extends BaseLuaNode {
  type: 'Program';
  body: LuaNode[];
}

export interface LuaIdentifier extends BaseLuaNode {
  type: 'Identifier';
  name: string;
  typeAnnotation?: LuaTypeAnnotation;
}

export interface LuaVariableDeclaration extends BaseLuaNode {
  type: 'VariableDeclaration';
  identifiers: LuaVariableDeclaratorIdentifier[];
  values: LuaVariableDeclaratorValue[];
}
export interface LuaNodeGroup extends BaseLuaNode {
  type: 'NodeGroup';
  body: LuaNode[];
}

export interface LuaBlockStatement extends BaseLuaNode {
  type: 'BlockStatement';
  body: LuaNode[];
}

export interface LuaReturnStatement extends BaseLuaNode {
  type: 'ReturnStatement';
  argument: LuaNode;
}

export interface LuaVariableDeclarator extends BaseLuaNode {
  type: 'VariableDeclarator';
  id: LuaLVal;
  init: LuaExpression | null;
}

export type LuaLVal = LuaIdentifier /*| MemberExpression | RestElement | AssignmentPattern | ArrayPattern | ObjectPattern | TSParameterProperty*/;

export interface LuaVariableDeclaratorIdentifier extends BaseLuaNode {
  type: 'VariableDeclaratorIdentifier';
  value: LuaLVal;
}

export interface LuaVariableDeclaratorValue extends BaseLuaNode {
  type: 'VariableDeclaratorValue';
  value: LuaExpression | null;
}

// TODO: Pattern | RestElement | TSParameterProperty should be added in the future when handled
export type LuaFunctionParam = LuaIdentifier;
export interface LuaFunctionDeclaration extends BaseLuaNode {
  type: 'FunctionDeclaration';
  id: LuaIdentifier;
  params: Array<LuaFunctionParam>;
  defaultValues: Array<any>; //TODO: should be <LuaAssignmentPattern>, but it's not available yet
  body: Array<LuaNode>;
  returnType?: LuaTypeAnnotation;
}

export interface LuaFunctionExpression extends BaseLuaNode {
  type: 'FunctionExpression';
  params: Array<LuaFunctionParam>;
  defaultValues: Array<any>; //TODO: should be <LuaAssignmentPattern>, but it's not available yet
  body: Array<LuaNode>;
  returnType?: LuaTypeAnnotation;
}

export interface LuaTypeAny extends BaseLuaNode {
  type: 'LuaTypeAny';
}

export interface LuaTypeString extends BaseLuaNode {
  type: 'LuaTypeString';
}

export interface LuaTypeNumber extends BaseLuaNode {
  type: 'LuaTypeNumber';
}

export interface LuaTypeBoolean extends BaseLuaNode {
  type: 'LuaTypeBoolean';
}

export interface LuaTypeVoid extends BaseLuaNode {
  type: 'LuaTypeVoid';
}

export interface LuaTypeLiteral extends BaseLuaNode {
  type: 'LuaTypeLiteral';
  members: Array<LuaTypeElement>;
}

export type LuaType =
  | LuaTypeAny
  | LuaTypeString
  | LuaTypeNumber
  | LuaTypeBoolean
  | LuaTypeLiteral
  | LuaTypeVoid;

export interface LuaTypeAnnotation extends BaseLuaNode {
  type: 'LuaTypeAnnotation';
  typeAnnotation: LuaType | null;
}

export interface LuaTypeAliasDeclaration extends BaseLuaNode {
  type: 'LuaTypeAliasDeclaration';
  id: LuaIdentifier;
  typeAnnotation: LuaType;
}
export interface LuaPropertySignature extends BaseLuaNode {
  type: 'LuaPropertySignature';
  key: LuaExpression;
  typeAnnotation?: LuaTypeAnnotation;
}

type LuaTypeElement = LuaPropertySignature; /*| TSCallSignatureDeclaration | TSConstructSignatureDeclaration |  TSMethodSignature | TSIndexSignature*/

// TODO: may have to add later any of these'&' | '|' | '>>' | '>>>' | '<<' | '^' | '==' | '===' | '!=' | '!==' | 'in' | 'instanceof' | '>' | '<' | '>=' | '<=';
export type LuaBinaryExpressionOperator =
  | '+'
  | '-'
  | '/'
  | '%'
  | '^'
  | '*'
  | '..'
  | '=='
  | '~=';

export interface LuaBinaryExpression extends BaseLuaNode {
  type: 'LuaBinaryExpression';
  operator: LuaBinaryExpressionOperator;
  left: LuaExpression;
  right: LuaExpression;
}
export interface LuaUnaryExpression extends BaseLuaNode {
  type: 'LuaUnaryExpression';
  operator: 'throw' | 'delete' | '!' | '-' | '~';
  argument: LuaExpression;
}

export interface LuaUnaryVoidExpression extends BaseLuaNode {
  type: 'LuaUnaryVoidExpression';
  argument: LuaExpression;
}

export interface LuaUnaryNegationExpression extends BaseLuaNode {
  type: 'LuaUnaryNegationExpression';
  argument: LuaExpression;
  extra: {
    argumentStart: number;
    argumentEnd: number;
  };
}

export interface LuaIndexExpression extends BaseLuaNode {
  type: 'IndexExpression';
  base: LuaExpression;
  index: LuaExpression;
}

export interface LuaMemberExpression extends BaseLuaNode {
  type: 'LuaMemberExpression';
  indexer: '.' | ':';
  base: LuaExpression;
  identifier: LuaIdentifier;
}
export interface LuaUnaryDeleteExpression extends BaseLuaNode {
  type: 'LuaUnaryDeleteExpression';
  argument: LuaExpression;
}

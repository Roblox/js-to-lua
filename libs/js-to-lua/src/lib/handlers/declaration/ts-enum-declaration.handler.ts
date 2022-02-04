import {
  Expression as BabelExpression,
  Identifier as BabelIdentifier,
  isBooleanLiteral as isBabelBooleanLiteral,
  isIdentifier as isBabelIdentifier,
  isNullLiteral as isBabelNullLiteral,
  isNumericLiteral as isBabelNumericLiteral,
  isStringLiteral as isBabelStringLiteral,
  numericLiteral as babelNumericLiteral,
  NumericLiteral as BabelNumericLiteral,
  PatternLike,
  TSEnumDeclaration,
  TSEnumMember,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultStatementHandler } from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaIdentifier,
  LuaNilLiteral,
  LuaNodeGroup,
  LuaTableKeyField,
  LuaType,
  nilLiteral,
  nodeGroup,
  tableConstructor,
  tableExpressionKeyField,
  tableKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeLiteral,
  typeNil,
  typeNumber,
  typePropertySignature,
  typeString,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { splitBy } from '@js-to-lua/shared-utils';

const autoIncrementMembers = (members: TSEnumMember[]): TSEnumMember[] => {
  type T = TSEnumMember & { initializer?: BabelExpression };
  type MemberGroup = TSEnumMember[] | T;

  // Group enum members so that members with numeric literals or default
  // initializers are together to simplify auto-increment logic.
  const groupedMembers: MemberGroup[] = members.reduce(
    splitBy(
      (node): node is T =>
        node.initializer != null && !isBabelNumericLiteral(node.initializer)
    ),
    []
  );

  let lastWasNumeric = true;
  let autoIncrement: number;

  const values = groupedMembers
    .map((elem) => {
      if (Array.isArray(elem)) {
        autoIncrement = -1;

        return elem.map((child) => {
          if (child.initializer) {
            // Currently non-numeric values aren't handled. TypeScript does
            // attempt to evaluate certain kinds of expressions at compile-time to
            // determine an auto-increment value, but we don't handle that here.
            if (isBabelNumericLiteral(child.initializer)) {
              autoIncrement = child.initializer.value;
              lastWasNumeric = true;
            } else {
              lastWasNumeric = false;
            }
          } else {
            autoIncrement++;
          }

          // Mock a TS numeric literal with our new value only if the previous
          // value was possible to auto-increment off of, and push undefined
          // otherwise (TS does this as well when transpiling to JS).
          let value: BabelNumericLiteral | null | undefined;
          if (lastWasNumeric) {
            value = babelNumericLiteral(autoIncrement);
          }
          return value;
        });
      } else {
        lastWasNumeric = false;
        return elem.initializer;
      }
    })
    .flat();

  return members.map((member, index) => {
    member.initializer = values[index];
    return member;
  });
};

const handleEnumInitializerTypes = (members: TSEnumMember[]): LuaType => {
  if (!members.length) {
    return typeAny();
  }

  const typesMap = new Map<string, LuaType>();

  for (const member of members) {
    const initializerType = member.initializer?.type;

    // Handle common primitive type literals and default to 'any' otherwise.
    if (initializerType == null || isBabelNullLiteral(member.initializer)) {
      typesMap.set('NullLiteral', typeNil());
    } else if (isBabelBooleanLiteral(member.initializer)) {
      typesMap.set(initializerType, typeBoolean());
    } else if (isBabelStringLiteral(member.initializer)) {
      typesMap.set(initializerType, typeString());
    } else if (isBabelNumericLiteral(member.initializer)) {
      typesMap.set(initializerType, typeNumber());
    } else {
      typesMap.set('Any', typeAny());
    }
  }

  const types = Array.from(typesMap.values());
  return types.length === 1 ? types[0] : typeUnion(types);
};

export const createTsEnumHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier,
    BabelIdentifier
  >,
  objectPropertyIdentifierHandlerFunction: HandlerFunction<
    LuaExpression,
    BabelIdentifier
  >,
  objectKeyExpressionHandlerFunction: HandlerFunction<
    LuaExpression,
    BabelExpression
  >,
  objectPropertyValueHandlerFunction: HandlerFunction<
    LuaExpression,
    BabelExpression | PatternLike
  >
) => {
  const handleEnumMember: BaseNodeHandler<LuaTableKeyField, TSEnumMember> =
    createHandler('TSEnumMember', (source, config, { id, initializer }) => {
      switch (id.type) {
        case 'Identifier':
          return tableKeyField(
            false,
            objectPropertyIdentifierHandlerFunction(source, config, id),
            initializer != null
              ? objectPropertyValueHandlerFunction(source, config, initializer)
              : nilLiteral()
          );
        default:
          return tableExpressionKeyField(
            objectKeyExpressionHandlerFunction(source, config, id),
            initializer != null
              ? objectPropertyValueHandlerFunction(source, config, initializer)
              : nilLiteral()
          );
      }
    });
  const handleEnumMembersTable = createHandlerFunction(
    (source, config, declaration: TSEnumDeclaration) => {
      return tableConstructor(
        autoIncrementMembers(declaration.members).map(
          handleEnumMember.handler(source, config)
        )
      );
    }
  );
  const handleEnumMemberTypes = createHandlerFunction(
    (source, config, declaration: TSEnumDeclaration) => {
      return handleEnumInitializerTypes(
        autoIncrementMembers(declaration.members)
      );
    }
  );

  return createHandler<LuaNodeGroup, TSEnumDeclaration>(
    'TSEnumDeclaration',
    (source, config, node) => {
      const id = handleIdentifier(source, config, node.id);

      if (!isBabelIdentifier(id)) {
        return defaultStatementHandler(source, config, node);
      }

      return nodeGroup([
        typeAliasDeclaration(
          id,
          typeLiteral([
            typePropertySignature(
              typeString(),
              typeAnnotation(handleEnumMemberTypes(source, config, node))
            ),
          ])
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(id)],
          [
            variableDeclaratorValue(
              handleEnumMembersTable(source, config, node)
            ),
          ]
        ),
      ]);
    }
  );
};

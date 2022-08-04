import {
  reassignComments,
  WithDoesExportExtra,
  withExportSkipExtras,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  isAssignmentStatement,
  isExportTypeStatement,
  isIdentifier,
  isMemberExpression,
  isNodeGroup,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNode,
  LuaStatement,
  LuaTypeAliasDeclaration,
  nilLiteral,
  typeAliasDeclaration,
  typeAny,
  typeCastExpression,
  typeQuery,
  typeReference,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';

type NamespaceStatements = {
  innerStatements: LuaStatement[];
  outerStatements: LuaStatement[];
};

export const getNamespaceStatements =
  (namespace: string) =>
  (
    exportedStatements: WithDoesExportExtra<LuaStatement>[]
  ): NamespaceStatements =>
    exportedStatements
      .map(getToInnerAndOuterStatements(namespace))
      .reduce(mergeInnerAndOuterStatements);

const getToInnerAndOuterStatements =
  (namespace: string) =>
  (statement: LuaStatement): NamespaceStatements => {
    if (isExportTypeStatement(statement)) {
      const namespacedId = `${namespace}_${statement.declaration.id.name}`;
      const outerStatements: LuaTypeAliasDeclaration[] = [
        {
          ...statement.declaration,
          id: reassignComments(
            {
              ...statement.declaration.id,
              name: namespacedId,
            },
            statement.declaration.id
          ),
        },
      ];
      const innerStatements = [
        typeAliasDeclaration(
          statement.declaration.id,
          typeReference(identifier(namespacedId))
        ),
      ];
      return {
        innerStatements,
        outerStatements,
      };
    }
    if (isNodeGroup(statement)) {
      return statement.body
        .map((bodyStatement): NamespaceStatements => {
          if (isExportsAssignment(bodyStatement)) {
            const [exportExpression] = bodyStatement.identifiers;
            return {
              innerStatements: [
                {
                  ...bodyStatement,
                  identifiers: [
                    {
                      ...exportExpression,
                      base: reassignComments(
                        identifier(namespace),
                        exportExpression.base
                      ),
                    },
                  ],
                },
              ],
              outerStatements: [],
            };
          } else if (isExportTypeStatement(bodyStatement)) {
            const typeIdName = bodyStatement.declaration.id.name;
            const namespacedId = `${namespace}_${typeIdName}`;
            const namespacedTypeId = identifier(`__${namespacedId}__type`);
            const outerStatements: LuaStatement[] = [
              withExportSkipExtras(
                variableDeclaration(
                  [variableDeclaratorIdentifier(namespacedTypeId)],
                  []
                )
              ),
              typeAliasDeclaration(
                identifier(namespacedId),
                typeQuery(namespacedTypeId)
              ),
            ];
            const innerStatements = [
              bodyStatement.declaration,
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [namespacedTypeId],
                [
                  typeCastExpression(
                    typeCastExpression(nilLiteral(), typeAny()),
                    typeReference(identifier(typeIdName))
                  ),
                ]
              ),
            ];
            return { innerStatements, outerStatements };
          }
          return {
            innerStatements: [bodyStatement],
            outerStatements: [],
          };
        })
        .reduce(mergeInnerAndOuterStatements);
    }

    return {
      innerStatements: [statement],
      outerStatements: [
        withTrailingConversionComment(
          unhandledStatement(),
          `ROBLOX TODO: Re-exporting '${statement.type}' from a namespace is not supported yet`
        ),
      ],
    };
  };

const mergeInnerAndOuterStatements = (
  result: NamespaceStatements,
  { innerStatements, outerStatements }: NamespaceStatements
) => {
  result.innerStatements.push(...innerStatements);
  result.outerStatements.push(...outerStatements);
  return result;
};

const isExportsAssignment = (
  node: LuaNode
): node is Omit<AssignmentStatement, 'identifiers' | 'values'> & {
  identifiers: [
    Omit<LuaMemberExpression, 'base'> & {
      base: LuaIdentifier;
    }
  ];
  values: [LuaIdentifier];
} =>
  isAssignmentStatement(node) &&
  node.identifiers.length === 1 &&
  isMemberExpression(node.identifiers[0]) &&
  isIdentifier(node.identifiers[0].base) &&
  node.identifiers[0].base.name === 'exports' &&
  isIdentifier(node.values[0]);

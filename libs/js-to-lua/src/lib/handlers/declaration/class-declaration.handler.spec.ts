import {
  blockStatement as babelBlockStatement,
  classBody,
  classDeclaration,
  ClassDeclaration,
  classMethod,
  classProperty,
  identifier as babelIdentifier,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  functionDeclaration,
  identifier,
  LuaNodeGroup,
  memberExpression,
  nodeGroup,
  returnStatement,
  selfIdentifier,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeLiteral,
  typePropertySignature,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { createWithSourceTypeExtra } from '../../utils/with-source-type-extra';
import { handleStatement } from '../expression-statement.handler';

const source = '';
const withSourceTypeExtra = createWithSourceTypeExtra('ClassDeclaration');

describe('Class Declaration', () => {
  describe('Base Class', () => {
    const baseClassDefaultExpectedNodes = [
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('BaseClass'))],
        [variableDeclaratorValue(tableConstructor())]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('BaseClass'), '.', identifier('__index'))],
        [identifier('BaseClass')]
      ),
    ];
    it('should convert class', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([])
      );

      const expected: LuaNodeGroup = withSourceTypeExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
          ),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            [
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(selfIdentifier()),
            ],
            undefined,
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class constructor to <ClassId>.new function', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classMethod(
            'constructor',
            babelIdentifier('constructor'),
            [],
            babelBlockStatement([])
          ),
        ])
      );

      const expected: LuaNodeGroup = withSourceTypeExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
          ),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier('BaseClass.new'),
            [],
            [
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(selfIdentifier()),
            ],
            undefined,
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class methods to <ClassId>:<methodName> function', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classMethod(
            'method',
            babelIdentifier('myMethod'),
            [],
            babelBlockStatement([])
          ),
        ])
      );

      const expected: LuaNodeGroup = withSourceTypeExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('myMethod'),
                  typeAnnotation(typeAny())
                ),
              ])
            ),
            `ROBLOX TODO: replace 'any' type/ add missing`
          ),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            [
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(selfIdentifier()),
            ],
            undefined,
            false
          ),
          functionDeclaration(
            identifier('BaseClass:myMethod'),
            [],
            [],
            undefined,
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert static class methods to <ClassId>.<methodName> function', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classMethod(
            'method',
            babelIdentifier('myStaticMethod'),
            [],
            babelBlockStatement([]),
            undefined,
            true
          ),
        ])
      );

      const expected: LuaNodeGroup = withSourceTypeExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
          ),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            [
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(selfIdentifier()),
            ],
            undefined,
            false
          ),
          functionDeclaration(
            identifier('BaseClass.myStaticMethod'),
            [],
            [],
            undefined,
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert static properties to <ClassId>.<property>', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classProperty(
            babelIdentifier('staticProperty'),
            babelStringLiteral('foo'),
            undefined,
            undefined,
            undefined,
            true
          ),
        ])
      );

      const expected: LuaNodeGroup = withSourceTypeExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
          ),
          ...baseClassDefaultExpectedNodes,
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                identifier('BaseClass'),
                '.',
                identifier('staticProperty')
              ),
            ],
            [stringLiteral('foo')]
          ),
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            [
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(selfIdentifier()),
            ],
            undefined,
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });
  });

  describe('SubClass', () => {
    const subClassDefaultExpectedNodes = [
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('SubClass'))],
        [
          variableDeclaratorValue(
            callExpression(identifier('setmetatable'), [
              tableConstructor(),
              tableConstructor([
                tableNameKeyField(
                  identifier('__index'),
                  identifier('BaseClass')
                ),
              ]),
            ])
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('SubClass'), '.', identifier('__index'))],
        [identifier('SubClass')]
      ),
    ];
    it('should convert class', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([])
      );

      const expected: LuaNodeGroup = withSourceTypeExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
          ),
          ...subClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            [
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(selfIdentifier()),
            ],
            undefined,
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class constructor to <ClassId>.new function', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([
          classMethod(
            'constructor',
            babelIdentifier('constructor'),
            [],
            babelBlockStatement([])
          ),
        ])
      );

      const expected: LuaNodeGroup = withSourceTypeExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
          ),
          ...subClassDefaultExpectedNodes,
          functionDeclaration(
            identifier('SubClass.new'),
            [],
            [
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(selfIdentifier()),
            ],
            undefined,
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class methods to <ClassId>:<methodName> function', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([
          classMethod(
            'method',
            babelIdentifier('myMethod'),
            [],
            babelBlockStatement([])
          ),
        ])
      );

      const expected: LuaNodeGroup = withSourceTypeExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(
              identifier('SubClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('myMethod'),
                  typeAnnotation(typeAny())
                ),
              ])
            ),
            `ROBLOX TODO: replace 'any' type/ add missing`
          ),
          ...subClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            [
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(selfIdentifier()),
            ],
            undefined,
            false
          ),
          functionDeclaration(
            identifier('SubClass:myMethod'),
            [],
            [],
            undefined,
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });
    it('should convert static class methods to <ClassId>.<methodName> function', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([
          classMethod(
            'method',
            babelIdentifier('myStaticMethod'),
            [],
            babelBlockStatement([]),
            undefined,
            true
          ),
        ])
      );

      const expected: LuaNodeGroup = withSourceTypeExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
          ),
          ...subClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            [
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(selfIdentifier()),
            ],
            undefined,
            false
          ),
          functionDeclaration(
            identifier('SubClass.myStaticMethod'),
            [],
            [],
            undefined,
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert static properties to <ClassId>.<property>', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([
          classProperty(
            babelIdentifier('staticProperty'),
            babelStringLiteral('foo'),
            undefined,
            undefined,
            undefined,
            true
          ),
        ])
      );

      const expected: LuaNodeGroup = withSourceTypeExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
          ),
          ...subClassDefaultExpectedNodes,
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                identifier('SubClass'),
                '.',
                identifier('staticProperty')
              ),
            ],
            [stringLiteral('foo')]
          ),
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            [
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(selfIdentifier()),
            ],
            undefined,
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });
  });
});

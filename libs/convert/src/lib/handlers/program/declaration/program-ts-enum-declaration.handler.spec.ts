import {
  program,
  typeAliasDeclaration,
  identifier,
  typeLiteral,
  typePropertySignature,
  typeAnnotation,
  typeString,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  nodeGroup,
  typeAny,
  typeNumber,
  typeNil,
  numericLiteral,
  nilLiteral,
  returnStatement,
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  memberExpression,
  exportTypeStatement,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';
describe('Program handler', () => {
  describe('TS: Enum Declaration', () => {
    it('should handle a simple enum declaration', () => {
      const given = getProgramNode(`
        enum SimpleEnum {
          foo = 'bar'
        }
      `);

      const expected = program([
        nodeGroup([
          typeAliasDeclaration(
            identifier('SimpleEnum'),
            typeLiteral([
              typePropertySignature(typeString(), typeAnnotation(typeString())),
            ])
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('SimpleEnum'))],
            [
              variableDeclaratorValue(
                tableConstructor([
                  tableNameKeyField(identifier('foo'), stringLiteral('bar')),
                ])
              ),
            ]
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle auto-incrementing enum values', () => {
      const given = getProgramNode(`
        enum AutoIncrementingEnum {
          ten = 10,
          eleven,
          twelve,
          invalid = 'bad',
          shouldBeNil,
          zero = 0,
          one
        }
      `);

      const expected = program([
        nodeGroup([
          typeAliasDeclaration(
            identifier('AutoIncrementingEnum'),
            typeLiteral([
              typePropertySignature(
                typeString(),
                typeAnnotation(
                  typeUnion([typeNumber(), typeString(), typeNil()])
                )
              ),
            ])
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('AutoIncrementingEnum'))],
            [
              variableDeclaratorValue(
                tableConstructor([
                  tableNameKeyField(identifier('ten'), numericLiteral(10)),
                  tableNameKeyField(identifier('eleven'), numericLiteral(11)),
                  tableNameKeyField(identifier('twelve'), numericLiteral(12)),
                  tableNameKeyField(
                    identifier('invalid'),
                    stringLiteral('bad')
                  ),
                  tableNameKeyField(identifier('shouldBeNil'), nilLiteral()),
                  tableNameKeyField(identifier('zero'), numericLiteral(0)),
                  tableNameKeyField(identifier('one'), numericLiteral(1)),
                ])
              ),
            ]
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle auto-incrementing enum values with non-zero reset values', () => {
      const given = getProgramNode(`
        enum AutoIncrementingEnum {
          ten = 10,
          eleven,
          twelve,
          invalid = 'bad',
          shouldBeNil,
          oneHundred = 100,
          oneHundredOne,
          oneHundredTwo
        }
      `);

      const expected = program([
        nodeGroup([
          typeAliasDeclaration(
            identifier('AutoIncrementingEnum'),
            typeLiteral([
              typePropertySignature(
                typeString(),
                typeAnnotation(
                  typeUnion([typeNumber(), typeString(), typeNil()])
                )
              ),
            ])
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('AutoIncrementingEnum'))],
            [
              variableDeclaratorValue(
                tableConstructor([
                  tableNameKeyField(identifier('ten'), numericLiteral(10)),
                  tableNameKeyField(identifier('eleven'), numericLiteral(11)),
                  tableNameKeyField(identifier('twelve'), numericLiteral(12)),
                  tableNameKeyField(
                    identifier('invalid'),
                    stringLiteral('bad')
                  ),
                  tableNameKeyField(identifier('shouldBeNil'), nilLiteral()),
                  tableNameKeyField(
                    identifier('oneHundred'),
                    numericLiteral(100)
                  ),
                  tableNameKeyField(
                    identifier('oneHundredOne'),
                    numericLiteral(101)
                  ),
                  tableNameKeyField(
                    identifier('oneHundredTwo'),
                    numericLiteral(102)
                  ),
                ])
              ),
            ]
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle an empty enum declaration', () => {
      const given = getProgramNode(`
        enum EmptyEnum {}
      `);

      const expected = program([
        nodeGroup([
          typeAliasDeclaration(
            identifier('EmptyEnum'),
            typeLiteral([
              typePropertySignature(typeString(), typeAnnotation(typeAny())),
            ])
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('EmptyEnum'))],
            [variableDeclaratorValue(tableConstructor([]))]
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle an enum with multiple literal types', () => {
      const given = getProgramNode(`
        enum FancyEnum {
          default,
          string = '',
          empty,
          anything = something
        }
      `);

      const expected = program([
        nodeGroup([
          typeAliasDeclaration(
            identifier('FancyEnum'),
            typeLiteral([
              typePropertySignature(
                typeString(),
                typeAnnotation(
                  typeUnion([typeNumber(), typeString(), typeNil(), typeAny()])
                )
              ),
            ])
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('FancyEnum'))],
            [
              variableDeclaratorValue(
                tableConstructor([
                  tableNameKeyField(identifier('default'), numericLiteral(0)),
                  tableNameKeyField(identifier('string'), stringLiteral('')),
                  tableNameKeyField(identifier('empty'), nilLiteral()),
                  tableNameKeyField(
                    identifier('anything'),
                    identifier('something')
                  ),
                ])
              ),
            ]
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle an exported enum with complex types', () => {
      const given = getProgramNode(`
        export enum FancyEnum {
          default,
          string = '',
          empty,
          anything = something
        }
      `);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor([]))]
        ),

        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('FancyEnum'))],
            [
              variableDeclaratorValue(
                tableConstructor([
                  tableNameKeyField(identifier('default'), numericLiteral(0)),
                  tableNameKeyField(identifier('string'), stringLiteral('')),
                  tableNameKeyField(identifier('empty'), nilLiteral()),
                  tableNameKeyField(
                    identifier('anything'),
                    identifier('something')
                  ),
                ])
              ),
            ]
          ),
          exportTypeStatement(
            typeAliasDeclaration(
              identifier('FancyEnum'),
              typeLiteral([
                typePropertySignature(
                  typeString(),
                  typeAnnotation(
                    typeUnion([
                      typeNumber(),
                      typeString(),
                      typeNil(),
                      typeAny(),
                    ])
                  )
                ),
              ])
            )
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                identifier('exports'),
                '.',
                identifier('FancyEnum')
              ),
            ],
            [identifier('FancyEnum')]
          ),
        ]),

        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});

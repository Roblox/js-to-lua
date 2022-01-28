import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  callExpression,
  functionExpression,
  identifier,
  memberExpression,
  numericLiteral,
  program,
  stringLiteral,
  tableConstructor,
  tableExpressionKeyField,
  tableNameKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Object expression', () => {
    it('should return empty Lua Table Constructor', () => {
      const given = getProgramNode(`
        foo = {}
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [tableConstructor()]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with TableNameKeyField elements`, () => {
      const given = getProgramNode(`
        foo = {
          foo: true,
          bar: 1,
          baz: 'abc'
        }
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            tableConstructor([
              tableNameKeyField(identifier('foo'), booleanLiteral(true)),
              tableNameKeyField(identifier('bar'), numericLiteral(1, '1')),
              tableNameKeyField(identifier('baz'), stringLiteral('abc')),
            ]),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with TableNameKeyField elements when shorthand JS notation is used`, () => {
      const given = getProgramNode(`
        foo = {
          foo,
          bar,
          baz,
        }
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            tableConstructor([
              tableNameKeyField(identifier('foo'), identifier('foo')),
              tableNameKeyField(identifier('bar'), identifier('bar')),
              tableNameKeyField(identifier('baz'), identifier('baz')),
            ]),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with TableExpressionKeyField elements`, () => {
      const given = getProgramNode(`
        foo = {
          "foo": true,
          'bar': 1,
          ['baz']: 'abc'
        }
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            tableConstructor([
              tableExpressionKeyField(
                stringLiteral('foo'),
                booleanLiteral(true)
              ),
              tableExpressionKeyField(
                stringLiteral('bar'),
                numericLiteral(1, '1')
              ),
              tableExpressionKeyField(
                stringLiteral('baz'),
                stringLiteral('abc')
              ),
            ]),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle object spread expression with undefined assigned to property`, () => {
      const given = getProgramNode(`
        foo = {
          ...bar,
          baz: undefined
        }
      `);

      const expected = program([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Object'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Object')
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            callExpression(
              memberExpression(identifier('Object'), '.', identifier('assign')),
              [
                tableConstructor(),
                identifier('bar'),
                tableConstructor([
                  tableNameKeyField(
                    identifier('baz'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                ]),
              ]
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle object spread expression with null assigned to property`, () => {
      const given = getProgramNode(`
        foo = {
          ...bar,
          baz: null
        }
      `);

      const expected = program([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Object'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Object')
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            callExpression(
              memberExpression(identifier('Object'), '.', identifier('assign')),
              [
                tableConstructor(),
                identifier('bar'),
                tableConstructor([
                  tableNameKeyField(
                    identifier('baz'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                ]),
              ]
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle object of objects`, () => {
      const given = getProgramNode(`
        foo = {
          foo0: {
            foo1: true
          },
          bar0: {
            bar1: 1
          },
          baz0: {
            baz1: 'abc'
          },
        }
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            tableConstructor([
              tableNameKeyField(
                identifier('foo0'),
                tableConstructor([
                  tableNameKeyField(identifier('foo1'), booleanLiteral(true)),
                ])
              ),
              tableNameKeyField(
                identifier('bar0'),
                tableConstructor([
                  tableNameKeyField(identifier('bar1'), numericLiteral(1, '1')),
                ])
              ),
              tableNameKeyField(
                identifier('baz0'),
                tableConstructor([
                  tableNameKeyField(identifier('baz1'), stringLiteral('abc')),
                ])
              ),
            ]),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle methods in objects`, () => {
      const given = getProgramNode(`
        foo = {
          method1: function(){

          },
          method2: function(name){

          }
        }
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            tableConstructor([
              tableNameKeyField(
                identifier('method1'),
                functionExpression([identifier('self')])
              ),
              tableNameKeyField(
                identifier('method2'),
                functionExpression([identifier('self'), identifier('name')])
              ),
            ]),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle deeply nested objects`, () => {
      const given = getProgramNode(`
        foo = {
          foo: {
            bar: {
              baz: {}
            }
          }
        }
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            tableConstructor([
              tableNameKeyField(
                identifier('foo'),
                tableConstructor([
                  tableNameKeyField(
                    identifier('bar'),
                    tableConstructor([
                      tableNameKeyField(identifier('baz'), tableConstructor()),
                    ])
                  ),
                ])
              ),
            ]),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with spread elements`, () => {
      const given = getProgramNode(`
        foo = {
          foo: true,
          bar: 1,
          ...{baz: 'abc'},
        }
      `);
      const expected = program([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Object'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Object')
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            callExpression(
              memberExpression(identifier('Object'), '.', identifier('assign')),
              [
                tableConstructor(),
                tableConstructor([
                  tableNameKeyField(identifier('foo'), booleanLiteral(true)),
                  tableNameKeyField(identifier('bar'), numericLiteral(1, '1')),
                ]),
                tableConstructor([
                  tableNameKeyField(identifier('baz'), stringLiteral('abc')),
                ]),
              ]
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with multiple spread elements`, () => {
      const given = getProgramNode(`
        foo = {
          ...{
            foo: true,
            bar: 1,
          },
          ...{baz: 'abc'},
        }
      `);
      const expected = program([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Object'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Object')
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            callExpression(
              memberExpression(identifier('Object'), '.', identifier('assign')),
              [
                tableConstructor(),
                tableConstructor([
                  tableNameKeyField(identifier('foo'), booleanLiteral(true)),
                  tableNameKeyField(identifier('bar'), numericLiteral(1, '1')),
                ]),
                tableConstructor([
                  tableNameKeyField(identifier('baz'), stringLiteral('abc')),
                ]),
              ]
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with multiple spread elements`, () => {
      const given = getProgramNode(`
        foo = {
          ...{
            foo: true,
            bar: 1,
          },
          ...{baz: 'abc'},
        }
      `);
      const expected = program([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Object'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Object')
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            callExpression(
              memberExpression(identifier('Object'), '.', identifier('assign')),
              [
                tableConstructor(),
                tableConstructor([
                  tableNameKeyField(identifier('foo'), booleanLiteral(true)),
                  tableNameKeyField(identifier('bar'), numericLiteral(1, '1')),
                ]),
                tableConstructor([
                  tableNameKeyField(identifier('baz'), stringLiteral('abc')),
                ]),
              ]
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with nested spread elements`, () => {
      const given = getProgramNode(`
        foo = {
          ...{
            foo: true,
            bar: 1,
            ...{baz: 'abc'},
          },
        }
      `);
      const expected = program([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Object'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Object')
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            callExpression(
              memberExpression(identifier('Object'), '.', identifier('assign')),
              [
                tableConstructor(),
                callExpression(
                  memberExpression(
                    identifier('Object'),
                    '.',
                    identifier('assign')
                  ),
                  [
                    tableConstructor(),
                    tableConstructor([
                      tableNameKeyField(
                        identifier('foo'),
                        booleanLiteral(true)
                      ),
                      tableNameKeyField(
                        identifier('bar'),
                        numericLiteral(1, '1')
                      ),
                    ]),
                    tableConstructor([
                      tableNameKeyField(
                        identifier('baz'),
                        stringLiteral('abc')
                      ),
                    ]),
                  ]
                ),
              ]
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with spread identifiers`, () => {
      const given = getProgramNode(`
        foo = {
          ...{
            foo: true,
            bar: 1,
            ...fizz
          },
          ...baz
        }
      `);
      const expected = program([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Object'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Object')
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [
            callExpression(
              memberExpression(identifier('Object'), '.', identifier('assign')),
              [
                tableConstructor(),
                callExpression(
                  memberExpression(
                    identifier('Object'),
                    '.',
                    identifier('assign')
                  ),
                  [
                    tableConstructor(),
                    tableConstructor([
                      tableNameKeyField(
                        identifier('foo'),
                        booleanLiteral(true)
                      ),
                      tableNameKeyField(
                        identifier('bar'),
                        numericLiteral(1, '1')
                      ),
                    ]),
                    identifier('fizz'),
                  ]
                ),
                identifier('baz'),
              ]
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});

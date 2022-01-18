import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  functionDeclaration,
  identifier,
  ifClause,
  ifStatement,
  LuaProgram,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  program,
  stringLiteral,
  typeAnnotation,
  typeAny,
  typeNumber,
  typeOptional,
  typeString,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

const source = '';

describe('Program handler', () => {
  describe('Function Declarations', () => {
    it('should handle function with no params', () => {
      const given = getProgramNode(`
        function foo() {}
      `);
      const expected: LuaProgram = program([
        functionDeclaration(identifier('foo'), [], nodeGroup([])),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });
  });

  it('should handle function with params', () => {
    const given = getProgramNode(`
      function foo(bar, baz) {}
    `);
    const expected: LuaProgram = program([
      functionDeclaration(
        identifier('foo'),
        [identifier('bar'), identifier('baz')],
        nodeGroup([])
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);
    expect(luaProgram).toEqual(expected);
  });

  it('should handle function with optional params', () => {
    const given = getProgramNode(`
      function foo(bar?, baz?: string) {}
    `);
    const expected: LuaProgram = program([
      functionDeclaration(
        identifier('foo'),
        [
          identifier('bar', typeAnnotation(typeOptional(typeAny()))),
          identifier('baz', typeAnnotation(typeOptional(typeString()))),
        ],
        nodeGroup([])
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);
    expect(luaProgram).toEqual(expected);
  });

  it('should handle function with destructured params', () => {
    const given = getProgramNode(`
      function foo({bar, baz}, [fizz,fuzz]) {}
    `);
    const expected: LuaProgram = program([
      functionDeclaration(
        identifier('foo'),
        [identifier('ref'), identifier('ref_')],
        nodeGroup([
          variableDeclaration(
            [
              variableDeclaratorIdentifier(identifier('bar')),
              variableDeclaratorIdentifier(identifier('baz')),
            ],
            [
              variableDeclaratorValue(
                memberExpression(identifier('ref'), '.', identifier('bar'))
              ),
              variableDeclaratorValue(
                memberExpression(identifier('ref'), '.', identifier('baz'))
              ),
            ]
          ),
          variableDeclaration(
            [
              variableDeclaratorIdentifier(identifier('fizz')),
              variableDeclaratorIdentifier(identifier('fuzz')),
            ],
            [
              variableDeclaratorValue(
                callExpression(identifier('table.unpack'), [
                  identifier('ref_'),
                  numericLiteral(1),
                  numericLiteral(2),
                ])
              ),
            ]
          ),
        ])
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);
    expect(luaProgram).toEqual(expected);
  });

  it('should handle function with params and default values', () => {
    const given = getProgramNode(`
      function foo(bar, baz = 'hello', fizz: string | number = 1) {}
    `);
    const expected: LuaProgram = program([
      functionDeclaration(
        identifier('foo'),
        [
          identifier('bar'),
          identifier('baz', typeAnnotation(typeOptional(typeString()))),
          identifier(
            'fizz',
            typeAnnotation(
              typeOptional(typeUnion([typeString(), typeNumber()]))
            )
          ),
        ],
        nodeGroup([
          ifStatement(
            ifClause(
              binaryExpression(identifier('baz'), '==', nilLiteral()),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [identifier('baz')],
                  [stringLiteral('hello')]
                ),
              ])
            )
          ),
          ifStatement(
            ifClause(
              binaryExpression(identifier('fizz'), '==', nilLiteral()),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [identifier('fizz')],
                  [numericLiteral(1, '1')]
                ),
              ])
            )
          ),
        ])
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);
    expect(luaProgram).toEqual(expected);
  });

  it('should handle function with function body', () => {
    const given = getProgramNode(`
    function foo(bar, baz = 'hello') {
      let fizz = 'fuzz';
    }
    `);

    const expected: LuaProgram = program([
      functionDeclaration(
        identifier('foo'),
        [
          identifier('bar'),
          identifier('baz', typeAnnotation(typeOptional(typeString()))),
        ],
        nodeGroup([
          ifStatement(
            ifClause(
              binaryExpression(identifier('baz'), '==', nilLiteral()),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [identifier('baz')],
                  [stringLiteral('hello')]
                ),
              ])
            )
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('fizz'))],
              [variableDeclaratorValue(stringLiteral('fuzz'))]
            ),
          ]),
        ])
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);
    expect(luaProgram).toEqual(expected);
  });
});

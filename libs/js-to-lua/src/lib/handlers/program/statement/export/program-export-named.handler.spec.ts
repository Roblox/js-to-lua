import {
  assignmentStatement,
  callExpression,
  exportTypeStatement,
  functionDeclaration,
  identifier,
  memberExpression,
  nodeGroup,
  numericLiteral,
  program,
  propertySignature,
  returnStatement,
  tableConstructor,
  typeAnnotation,
  typeAliasDeclaration,
  typeLiteral,
  typeString,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../../program.spec.utils';
import { handleProgram } from '../../program.handler';

const source = '';

describe('Program handler', () => {
  describe('Export Named Handler', () => {
    it(`should export named variable declaration`, () => {
      const given = getProgramNode(`
        export const foo = 10
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('foo'))],
            [variableDeclaratorValue(numericLiteral(10, '10'))]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('foo'))],
            [identifier('foo')]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export named function declaration`, () => {
      const given = getProgramNode(`
        export function foo() {}
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          functionDeclaration(identifier('foo'), [], []),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('foo'))],
            [identifier('foo')]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export multiple named declarations`, () => {
      const given = getProgramNode(`
        export function foo() {}
        export const bar = 10
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          functionDeclaration(identifier('foo'), [], []),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('foo'))],
            [identifier('foo')]
          ),
        ]),
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('bar'))],
            [variableDeclaratorValue(numericLiteral(10, '10'))]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('bar'))],
            [identifier('bar')]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export named list`, () => {
      const given = getProgramNode(`
        function foo() {}
        const bar = 10
        export { foo, bar }
      `);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        functionDeclaration(identifier('foo'), [], []),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('bar'))],
          [variableDeclaratorValue(numericLiteral(10, '10'))]
        ),
        nodeGroup([
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('foo'))],
            [identifier('foo')]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('bar'))],
            [identifier('bar')]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export named list with alias identifiers`, () => {
      const given = getProgramNode(`
        function foo() {}
        const bar = 10
        export { foo as foo1, bar as bar1 }
      `);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        functionDeclaration(identifier('foo'), [], []),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('bar'))],
          [variableDeclaratorValue(numericLiteral(10, '10'))]
        ),
        nodeGroup([
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('foo1'))],
            [identifier('foo')]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('bar1'))],
            [identifier('bar')]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export named list with default alias`, () => {
      const given = getProgramNode(`
        function foo() {}
        export { foo as default }
      `);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        functionDeclaration(identifier('foo'), [], []),
        nodeGroup([
          assignmentStatement(
            [
              memberExpression(
                identifier('exports'),
                '.',
                identifier('default')
              ),
            ],
            [identifier('foo')]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export named type alias`, () => {
      const given = getProgramNode(`
        export type Foo = {foo: string};
      `);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        exportTypeStatement(
          typeAliasDeclaration(
            identifier('Foo'),
            typeLiteral([
              propertySignature(
                identifier('foo'),
                typeAnnotation(typeString())
              ),
            ])
          )
        ),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });

  describe('Re-Export relative Named Handler', () => {
    it(`should re-export named list`, () => {
      const given = getProgramNode(`
        export { foo, bar } from './foo/bar'
      `);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('script'),
                    '.',
                    memberExpression(
                      identifier('Parent'),
                      '.',
                      memberExpression(
                        identifier('foo'),
                        '.',
                        identifier('bar')
                      )
                    )
                  ),
                ])
              ),
            ]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('foo'))],
            [memberExpression(identifier('barModule'), '.', identifier('foo'))]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('bar'))],
            [memberExpression(identifier('barModule'), '.', identifier('bar'))]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should re-export named list with alias identifiers`, () => {
      const given = getProgramNode(`
        export { foo as foo1, bar as bar1 } from './foo/bar'
      `);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('script'),
                    '.',
                    memberExpression(
                      identifier('Parent'),
                      '.',
                      memberExpression(
                        identifier('foo'),
                        '.',
                        identifier('bar')
                      )
                    )
                  ),
                ])
              ),
            ]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('foo1'))],
            [memberExpression(identifier('barModule'), '.', identifier('foo'))]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('bar1'))],
            [memberExpression(identifier('barModule'), '.', identifier('bar'))]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should re-export named list with default alias`, () => {
      const given = getProgramNode(`
        export { foo as default }  from './foo/bar'
      `);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          assignmentStatement(
            [
              memberExpression(
                identifier('exports'),
                '.',
                identifier('default')
              ),
            ],
            [
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('script'),
                    '.',
                    memberExpression(
                      identifier('Parent'),
                      '.',
                      memberExpression(
                        identifier('foo'),
                        '.',
                        identifier('bar')
                      )
                    )
                  ),
                ]),
                '.',
                identifier('foo')
              ),
            ]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });

  describe('Re-Export absolute Named Handler', () => {
    it(`should re-export named list`, () => {
      const given = getProgramNode(`
        export { foo, bar } from 'foo/bar'
      `);

      const expected = program([
        withConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('Packages'),
                    '.',
                    memberExpression(identifier('foo'), '.', identifier('bar'))
                  ),
                ])
              ),
            ]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('foo'))],
            [memberExpression(identifier('barModule'), '.', identifier('foo'))]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('bar'))],
            [memberExpression(identifier('barModule'), '.', identifier('bar'))]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should re-export named list with alias identifiers`, () => {
      const given = getProgramNode(`
        export { foo as foo1, bar as bar1 } from 'foo/bar'
      `);

      const expected = program([
        withConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('Packages'),
                    '.',
                    memberExpression(identifier('foo'), '.', identifier('bar'))
                  ),
                ])
              ),
            ]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('foo1'))],
            [memberExpression(identifier('barModule'), '.', identifier('foo'))]
          ),
          assignmentStatement(
            [memberExpression(identifier('exports'), '.', identifier('bar1'))],
            [memberExpression(identifier('barModule'), '.', identifier('bar'))]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should re-export named list with default alias`, () => {
      const given = getProgramNode(`
        export { foo as default }  from 'foo/bar'
      `);

      const expected = program([
        withConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          assignmentStatement(
            [
              memberExpression(
                identifier('exports'),
                '.',
                identifier('default')
              ),
            ],
            [
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('Packages'),
                    '.',
                    memberExpression(identifier('foo'), '.', identifier('bar'))
                  ),
                ]),
                '.',
                identifier('foo')
              ),
            ]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});

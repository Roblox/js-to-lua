import {
  callExpression,
  identifier,
  LuaProgram,
  memberExpression,
  nodeGroup,
  numericLiteral,
  program,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  objectAssign,
  tableConstructor,
  tableNameKeyField,
  objectNone,
  indexExpression,
  tableExpressionKeyField,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('Variable Declarations', () => {
    it('should handle let: not initialized', () => {
      const given = getProgramNode(`
     let foo;
    `);
      const expected: LuaProgram = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          []
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });

  it('should handle let: initialized', () => {
    const given = getProgramNode(`
   let foo = 'foo';
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(stringLiteral('foo'))]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle let: multiple', () => {
    const given = getProgramNode(`
    let foo, bar = 'bar';
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(null),
          variableDeclaratorValue(stringLiteral('bar')),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle let: multiple - partially initialized', () => {
    const given = getProgramNode(`
    let foo = 'foo', bar;
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [variableDeclaratorValue(stringLiteral('foo'))]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle const', () => {
    const given = getProgramNode(`
   const foo = 'foo';
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(stringLiteral('foo'))]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle const: multiple', () => {
    const given = getProgramNode(`
    const foo = 'foo', bar = 'bar';

  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(stringLiteral('foo')),
          variableDeclaratorValue(stringLiteral('bar')),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: not initialized', () => {
    const given = getProgramNode(`
    var foo;
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        []
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: initialized', () => {
    const given = getProgramNode(`
   var foo = 'foo';
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(stringLiteral('foo'))]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: multiple', () => {
    const given = getProgramNode(`
   var foo, bar = 'bar';
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(null),
          variableDeclaratorValue(stringLiteral('bar')),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: multiple - partially initialized', () => {
    const given = getProgramNode(`
   var foo = 'foo', bar;
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [variableDeclaratorValue(stringLiteral('foo'))]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle array destructuring`, () => {
    const given = getProgramNode(`
    const [foo, bar] = baz;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(
            callExpression(identifier('table.unpack'), [
              identifier('baz'),
              numericLiteral(1),
              numericLiteral(2),
            ])
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle array destructuring with nested arrays`, () => {
    const given = getProgramNode(`
    const [foo, [bar,baz]] = fizz;
  `);
    const expected: LuaProgram = program([
      nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('table.unpack'), [
                identifier('fizz'),
                numericLiteral(1),
                numericLiteral(1),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [
            variableDeclaratorIdentifier(identifier('bar')),
            variableDeclaratorIdentifier(identifier('baz')),
          ],
          [
            variableDeclaratorValue(
              callExpression(identifier('table.unpack'), [
                callExpression(identifier('table.unpack'), [
                  identifier('fizz'),
                  numericLiteral(2),
                  numericLiteral(2),
                ]),
                numericLiteral(1),
                numericLiteral(2),
              ])
            ),
          ]
        ),
      ]),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle array destructuring with rest element`, () => {
    const given = getProgramNode(`
    const [foo, ...bar] = baz;
  `);

    const expected: LuaProgram = program([
      nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('table.unpack'), [
                identifier('baz'),
                numericLiteral(1),
                numericLiteral(1),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('bar'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('table.pack'), [
                callExpression(identifier('table.unpack'), [
                  identifier('baz'),
                  numericLiteral(2),
                ]),
              ])
            ),
          ]
        ),
      ]),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring`, () => {
    const given = getProgramNode(`
    const {foo, bar} = baz;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('baz'), '.', identifier('foo'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('baz'), '.', identifier('bar'))
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with aliases`, () => {
    const given = getProgramNode(`
    const {foo:fun, bar:bat} = baz;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('fun')),
          variableDeclaratorIdentifier(identifier('bat')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('baz'), '.', identifier('foo'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('baz'), '.', identifier('bar'))
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with rest element`, () => {
    const given = getProgramNode(`
    const {foo, ...bar} = baz;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('baz'), '.', identifier('foo'))
          ),
          variableDeclaratorValue(
            callExpression(objectAssign(), [
              tableConstructor(),
              identifier('baz'),
              tableConstructor([
                tableNameKeyField(identifier('foo'), objectNone()),
              ]),
            ])
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with nested object pattern`, () => {
    const given = getProgramNode(`
    const {foo:{bar,baz}} = fizz;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('bar')),
          variableDeclaratorIdentifier(identifier('baz')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(
              memberExpression(identifier('fizz'), '.', identifier('foo')),
              '.',
              identifier('bar')
            )
          ),
          variableDeclaratorValue(
            memberExpression(
              memberExpression(identifier('fizz'), '.', identifier('foo')),
              '.',
              identifier('baz')
            )
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with rest element and aliases`, () => {
    const given = getProgramNode(`
    const { a, b, 'foo-bar': bar, method1, ...rest } = foo;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('a')),
          variableDeclaratorIdentifier(identifier('b')),
          variableDeclaratorIdentifier(identifier('bar')),
          variableDeclaratorIdentifier(identifier('method1')),
          variableDeclaratorIdentifier(identifier('rest')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('a'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('b'))
          ),
          variableDeclaratorValue(
            indexExpression(identifier('foo'), stringLiteral('foo-bar'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('method1'))
          ),
          variableDeclaratorValue(
            callExpression(objectAssign(), [
              tableConstructor(),
              identifier('foo'),
              tableConstructor([
                tableNameKeyField(identifier('a'), objectNone()),
                tableNameKeyField(identifier('b'), objectNone()),
                tableExpressionKeyField(stringLiteral('foo-bar'), objectNone()),
                tableNameKeyField(identifier('method1'), objectNone()),
              ]),
            ])
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with rest element, aliases and computed properties`, () => {
    const given = getProgramNode(`
    const { a, b, 'foo-bar': bar, method1, [bar]: computed, ...rest } = foo;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('a')),
          variableDeclaratorIdentifier(identifier('b')),
          variableDeclaratorIdentifier(identifier('bar')),
          variableDeclaratorIdentifier(identifier('method1')),
          variableDeclaratorIdentifier(identifier('computed')),
          variableDeclaratorIdentifier(identifier('rest')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('a'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('b'))
          ),
          variableDeclaratorValue(
            indexExpression(identifier('foo'), stringLiteral('foo-bar'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('method1'))
          ),
          variableDeclaratorValue(
            indexExpression(identifier('foo'), identifier('bar'))
          ),
          variableDeclaratorValue(
            callExpression(objectAssign(), [
              tableConstructor(),
              identifier('foo'),
              tableConstructor([
                tableNameKeyField(identifier('a'), objectNone()),
                tableNameKeyField(identifier('b'), objectNone()),
                tableExpressionKeyField(stringLiteral('foo-bar'), objectNone()),
                tableNameKeyField(identifier('method1'), objectNone()),
                tableExpressionKeyField(identifier('bar'), objectNone()),
              ]),
            ])
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });
});

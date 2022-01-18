import {
  arrayPolyfilledMethodNames,
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  memberExpression,
  nodeGroup,
  numericLiteral,
  program,
  returnStatement,
  tableConstructor,
  tableNoKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

describe('Program handler', () => {
  describe('Call Expression Handler', () => {
    describe('Known Array method calls Handler', () => {
      describe('for definitely an array', () => {
        it('should handle array push method with single argument', () => {
          const source = `
            [].push(1)
          `;
          const given = getProgramNode(source);

          const expected = program([
            expressionStatement(
              callExpression(
                memberExpression(
                  identifier('table'),
                  '.',
                  identifier('insert')
                ),
                [tableConstructor(), numericLiteral(1, '1')]
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle array push method with multiple arguments', () => {
          const source = `
            [].push(1, 2)
          `;
          const given = getProgramNode(source);

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
              [variableDeclaratorIdentifier(identifier('Array'))],
              [
                variableDeclaratorValue(
                  memberExpression(
                    identifier('LuauPolyfill'),
                    '.',
                    identifier('Array')
                  )
                ),
              ]
            ),
            expressionStatement(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('concat')
                ),
                [
                  tableConstructor(),
                  tableConstructor([
                    tableNoKeyField(numericLiteral(1, '1')),
                    tableNoKeyField(numericLiteral(2, '2')),
                  ]),
                ]
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle array unshift method with single argument', () => {
          const source = `
            [].unshift(5)
          `;
          const given = getProgramNode(source);

          const expected = program([
            expressionStatement(
              callExpression(
                memberExpression(
                  identifier('table'),
                  '.',
                  identifier('insert')
                ),
                [tableConstructor(), numericLiteral(1), numericLiteral(5, '5')]
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle array unshift method with multiple arguments', () => {
          const source = `
            [].unshift(1, 2)
          `;
          const given = getProgramNode(source);

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
              [variableDeclaratorIdentifier(identifier('Array'))],
              [
                variableDeclaratorValue(
                  memberExpression(
                    identifier('LuauPolyfill'),
                    '.',
                    identifier('Array')
                  )
                ),
              ]
            ),
            expressionStatement(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('unshift')
                ),
                [
                  tableConstructor(),
                  numericLiteral(1, '1'),
                  numericLiteral(2, '2'),
                ]
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle array pop method with no argument', () => {
          const source = `
            [].pop()
          `;
          const given = getProgramNode(source);

          const expected = program([
            expressionStatement(
              callExpression(
                memberExpression(
                  identifier('table'),
                  '.',
                  identifier('remove')
                ),
                [tableConstructor()]
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle array shift method with no argument', () => {
          const source = `
            [].shift()
          `;
          const given = getProgramNode(source);

          const expected = program([
            expressionStatement(
              callExpression(
                memberExpression(
                  identifier('table'),
                  '.',
                  identifier('remove')
                ),
                [tableConstructor(), numericLiteral(1)]
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        arrayPolyfilledMethodNames.forEach((methodName) => {
          it(`should handle array polyfilled method: ${methodName}`, () => {
            const source = `
              [].${methodName}(1, 2)
            `;
            const given = getProgramNode(source);

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
                [variableDeclaratorIdentifier(identifier('Array'))],
                [
                  variableDeclaratorValue(
                    memberExpression(
                      identifier('LuauPolyfill'),
                      '.',
                      identifier('Array')
                    )
                  ),
                ]
              ),
              expressionStatement(
                callExpression(
                  memberExpression(
                    identifier('Array'),
                    '.',
                    identifier(methodName)
                  ),
                  [
                    tableConstructor(),
                    numericLiteral(1, '1'),
                    numericLiteral(2, '2'),
                  ]
                )
              ),
            ]);

            expect(handleProgram.handler(source, {}, given)).toEqual(expected);
          });
        });
      });

      describe('for possible an array', () => {
        it('should handle array push method with single argument', () => {
          const source = `
            arr.push(1)
          `;
          const given = getProgramNode(source);

          const expected = program([
            expressionStatement(
              withTrailingConversionComment(
                callExpression(
                  memberExpression(
                    identifier('table'),
                    '.',
                    identifier('insert')
                  ),
                  [identifier('arr'), numericLiteral(1, '1')]
                ),
                `ROBLOX CHECK: check if 'arr' is an Array`
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle array push method with multiple arguments', () => {
          const source = `
            arr.push(1, 2)
          `;
          const given = getProgramNode(source);

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
              [variableDeclaratorIdentifier(identifier('Array'))],
              [
                variableDeclaratorValue(
                  memberExpression(
                    identifier('LuauPolyfill'),
                    '.',
                    identifier('Array')
                  )
                ),
              ]
            ),
            expressionStatement(
              withTrailingConversionComment(
                callExpression(
                  memberExpression(
                    identifier('Array'),
                    '.',
                    identifier('concat')
                  ),
                  [
                    identifier('arr'),
                    tableConstructor([
                      tableNoKeyField(numericLiteral(1, '1')),
                      tableNoKeyField(numericLiteral(2, '2')),
                    ]),
                  ]
                ),
                `ROBLOX CHECK: check if 'arr' is an Array`
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle array unshift method with single argument', () => {
          const source = `
            arr.unshift(5)
          `;
          const given = getProgramNode(source);

          const expected = program([
            expressionStatement(
              withTrailingConversionComment(
                callExpression(
                  memberExpression(
                    identifier('table'),
                    '.',
                    identifier('insert')
                  ),
                  [identifier('arr'), numericLiteral(1), numericLiteral(5, '5')]
                ),
                `ROBLOX CHECK: check if 'arr' is an Array`
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle array unshift method with multiple arguments', () => {
          const source = `
            arr.unshift(1, 2)
          `;
          const given = getProgramNode(source);

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
              [variableDeclaratorIdentifier(identifier('Array'))],
              [
                variableDeclaratorValue(
                  memberExpression(
                    identifier('LuauPolyfill'),
                    '.',
                    identifier('Array')
                  )
                ),
              ]
            ),
            expressionStatement(
              withTrailingConversionComment(
                callExpression(
                  memberExpression(
                    identifier('Array'),
                    '.',
                    identifier('unshift')
                  ),
                  [
                    identifier('arr'),
                    numericLiteral(1, '1'),
                    numericLiteral(2, '2'),
                  ]
                ),
                `ROBLOX CHECK: check if 'arr' is an Array`
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle array pop method with no argument', () => {
          const source = `
            arr.pop()
          `;
          const given = getProgramNode(source);

          const expected = program([
            expressionStatement(
              withTrailingConversionComment(
                callExpression(
                  memberExpression(
                    identifier('table'),
                    '.',
                    identifier('remove')
                  ),
                  [identifier('arr')]
                ),
                `ROBLOX CHECK: check if 'arr' is an Array`
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle array shift method with no argument', () => {
          const source = `
            arr.shift()
          `;
          const given = getProgramNode(source);

          const expected = program([
            expressionStatement(
              withTrailingConversionComment(
                callExpression(
                  memberExpression(
                    identifier('table'),
                    '.',
                    identifier('remove')
                  ),
                  [identifier('arr'), numericLiteral(1)]
                ),
                `ROBLOX CHECK: check if 'arr' is an Array`
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should handle chained methods', () => {
          const source = `
            arr
              .filter(() => 1)
              .map(() => 2)
              .reduce(() => 3)
          `;
          const given = getProgramNode(source);

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
              [variableDeclaratorIdentifier(identifier('Array'))],
              [
                variableDeclaratorValue(
                  memberExpression(
                    identifier('LuauPolyfill'),
                    '.',
                    identifier('Array')
                  )
                ),
              ]
            ),
            expressionStatement(
              callExpression(
                memberExpression(
                  identifier('Array'),
                  '.',
                  identifier('reduce')
                ),
                [
                  callExpression(
                    memberExpression(
                      identifier('Array'),
                      '.',
                      identifier('map')
                    ),
                    [
                      withTrailingConversionComment(
                        callExpression(
                          memberExpression(
                            identifier('Array'),
                            '.',
                            identifier('filter')
                          ),
                          [
                            identifier('arr'),
                            functionExpression(
                              [],
                              nodeGroup([
                                returnStatement(numericLiteral(1, '1')),
                              ])
                            ),
                          ]
                        ),
                        `ROBLOX CHECK: check if 'arr' is an Array`
                      ),
                      functionExpression(
                        [],
                        nodeGroup([returnStatement(numericLiteral(2, '2'))])
                      ),
                    ]
                  ),
                  functionExpression(
                    [],
                    nodeGroup([returnStatement(numericLiteral(3, '3'))])
                  ),
                ]
              )
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        arrayPolyfilledMethodNames.forEach((methodName) => {
          it(`should handle array polyfilled method: ${methodName}`, () => {
            const source = `
              arr.${methodName}(1, 2)
            `;
            const given = getProgramNode(source);

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
                [variableDeclaratorIdentifier(identifier('Array'))],
                [
                  variableDeclaratorValue(
                    memberExpression(
                      identifier('LuauPolyfill'),
                      '.',
                      identifier('Array')
                    )
                  ),
                ]
              ),
              expressionStatement(
                withTrailingConversionComment(
                  callExpression(
                    memberExpression(
                      identifier('Array'),
                      '.',
                      identifier(methodName)
                    ),
                    [
                      identifier('arr'),
                      numericLiteral(1, '1'),
                      numericLiteral(2, '2'),
                    ]
                  ),
                  `ROBLOX CHECK: check if 'arr' is an Array`
                )
              ),
            ]);

            expect(handleProgram.handler(source, {}, given)).toEqual(expected);
          });
        });
      });

      describe('for unpolyfilled methods', () => {
        ['reduceRight'].forEach((methodName) => {
          it(`should handle array unpolyfilled method: ${methodName}`, () => {
            const source = `
              arr.${methodName}(1, 2)
            `;
            const given = getProgramNode(source);

            const expected = program([
              expressionStatement(
                callExpression(
                  memberExpression(
                    identifier('arr'),
                    ':',
                    identifier(methodName)
                  ),
                  [numericLiteral(1, '1'), numericLiteral(2, '2')]
                )
              ),
            ]);

            expect(handleProgram.handler(source, {}, given)).toEqual(expected);
          });
        });
      });
    });
  });
});

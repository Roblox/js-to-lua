import {
  arrayPolyfilledMethodNames,
  tableUnpack,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  memberExpression,
  nodeGroup,
  numericLiteral,
  returnStatement,
  tableConstructor,
  tableNoKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

describe('Program handler', () => {
  describe('Call Expression Handler', () => {
    describe('Known Array method calls Handler', () => {
      describe('for definitely an array', () => {
        it('should handle array push method with single argument', () => {
          const source = `
            [].push(1)
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle array push method with multiple arguments', () => {
          const source = `
            [].push(1, 2)
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle array unshift method with single argument', () => {
          const source = `
            [].unshift(5)
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle array unshift method with multiple arguments', () => {
          const source = `
            [].unshift(1, 2)
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle array pop method with no argument', () => {
          const source = `
            [].pop()
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle array shift method with no argument', () => {
          const source = `
            [].shift()
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        describe('call', () => {
          it('should handle array push method with single argument', () => {
            const source = `
              [].push.call([], 1)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array push method with multiple arguments', () => {
            const source = `
              [].push.call([], 1, 2)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array unshift method with single argument', () => {
            const source = `
              [].unshift.call([], 5)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
              expressionStatement(
                callExpression(
                  memberExpression(
                    identifier('table'),
                    '.',
                    identifier('insert')
                  ),
                  [
                    tableConstructor(),
                    numericLiteral(1),
                    numericLiteral(5, '5'),
                  ]
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array unshift method with multiple arguments', () => {
            const source = `
              [].unshift.call([], 1, 2)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array pop method with no argument', () => {
            const source = `
              [].pop.call([])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array shift method with no argument', () => {
            const source = `
              [].shift.call([])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });
        });

        describe('apply', () => {
          it('should handle array push method with single argument', () => {
            const source = `
              [].push.apply([], [1])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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
                    tableConstructor([tableNoKeyField(numericLiteral(1, '1'))]),
                  ]
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array push method with multiple arguments', () => {
            const source = `
              [].push.apply([], [1, 2])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array unshift method with single argument', () => {
            const source = `
              [].unshift.apply([], [5])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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
                    callExpression(tableUnpack(), [
                      tableConstructor([
                        tableNoKeyField(numericLiteral(5, '5')),
                      ]),
                    ]),
                  ]
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array unshift method with multiple arguments', () => {
            const source = `
              [].unshift.apply([], [1, 2])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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
                    callExpression(tableUnpack(), [
                      tableConstructor([
                        tableNoKeyField(numericLiteral(1, '1')),
                        tableNoKeyField(numericLiteral(2, '2')),
                      ]),
                    ]),
                  ]
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array pop method with no argument', () => {
            const source = `
              [].pop.apply([])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array shift method with no argument', () => {
            const source = `
              [].shift.apply([])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });
        });

        describe.each(arrayPolyfilledMethodNames)(
          'array polyfilled method: %s',
          (methodName) => {
            it('should handle simple call', () => {
              const source = `
              [].${methodName}(1, 2)
            `;
              const given = getProgramNode(source);

              const expected = programWithUpstreamComment([
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

              expect(convertProgram(source, {}, given)).toEqual(expected);
            });

            it('should handle when using call', () => {
              const source = `
              [].${methodName}.call(arr, 1, 2)
            `;
              const given = getProgramNode(source);

              const expected = programWithUpstreamComment([
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
                      identifier('arr'),
                      numericLiteral(1, '1'),
                      numericLiteral(2, '2'),
                    ]
                  )
                ),
              ]);

              expect(convertProgram(source, {}, given)).toEqual(expected);
            });

            it('should handle when using apply', () => {
              const source = `
              [].${methodName}.apply(arr, [1, 2])
            `;
              const given = getProgramNode(source);

              const expected = programWithUpstreamComment([
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
                      identifier('arr'),
                      callExpression(tableUnpack(), [
                        tableConstructor([
                          tableNoKeyField(numericLiteral(1, '1')),
                          tableNoKeyField(numericLiteral(2, '2')),
                        ]),
                      ]),
                    ]
                  )
                ),
              ]);

              expect(convertProgram(source, {}, given)).toEqual(expected);
            });
          }
        );
      });

      describe('for possible an array', () => {
        it('should handle array push method with single argument', () => {
          const source = `
            arr.push(1)
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle array push method with multiple arguments', () => {
          const source = `
            arr.push(1, 2)
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle array unshift method with single argument', () => {
          const source = `
            arr.unshift(5)
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle array unshift method with multiple arguments', () => {
          const source = `
            arr.unshift(1, 2)
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle array pop method with no argument', () => {
          const source = `
            arr.pop()
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle array shift method with no argument', () => {
          const source = `
            arr.shift()
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        it('should handle chained methods', () => {
          const source = `
            arr
              .filter(() => 1)
              .map(() => 2)
              .reduce(() => 3)
          `;
          const given = getProgramNode(source);

          const expected = programWithUpstreamComment([
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

          expect(convertProgram(source, {}, given)).toEqual(expected);
        });

        describe('call', () => {
          it('should handle array push method with single argument', () => {
            const source = `
              arr.push.call(otherArr, 1)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
              expressionStatement(
                withTrailingConversionComment(
                  callExpression(
                    memberExpression(
                      identifier('table'),
                      '.',
                      identifier('insert')
                    ),
                    [identifier('otherArr'), numericLiteral(1, '1')]
                  ),
                  `ROBLOX CHECK: check if 'arr' is an Array`
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array push method with multiple arguments', () => {
            const source = `
              arr.push.call(otherArr, 1, 2)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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
                      identifier('otherArr'),
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array unshift method with single argument', () => {
            const source = `
              arr.unshift.call(otherArr, 5)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
              expressionStatement(
                withTrailingConversionComment(
                  callExpression(
                    memberExpression(
                      identifier('table'),
                      '.',
                      identifier('insert')
                    ),
                    [
                      identifier('otherArr'),
                      numericLiteral(1),
                      numericLiteral(5, '5'),
                    ]
                  ),
                  `ROBLOX CHECK: check if 'arr' is an Array`
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array unshift method with multiple arguments', () => {
            const source = `
              arr.unshift.call(otherArr, 1, 2)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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
                      identifier('otherArr'),
                      numericLiteral(1, '1'),
                      numericLiteral(2, '2'),
                    ]
                  ),
                  `ROBLOX CHECK: check if 'arr' is an Array`
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array pop method with no argument', () => {
            const source = `
              arr.pop.call(otherArr)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
              expressionStatement(
                withTrailingConversionComment(
                  callExpression(
                    memberExpression(
                      identifier('table'),
                      '.',
                      identifier('remove')
                    ),
                    [identifier('otherArr')]
                  ),
                  `ROBLOX CHECK: check if 'arr' is an Array`
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array shift method with no argument', () => {
            const source = `
              arr.shift.call(otherArr)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
              expressionStatement(
                withTrailingConversionComment(
                  callExpression(
                    memberExpression(
                      identifier('table'),
                      '.',
                      identifier('remove')
                    ),
                    [identifier('otherArr'), numericLiteral(1)]
                  ),
                  `ROBLOX CHECK: check if 'arr' is an Array`
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });
        });

        describe('apply', () => {
          it('should handle array push method with single argument', () => {
            const source = `
              [].push.apply([], [1])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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
                    tableConstructor([tableNoKeyField(numericLiteral(1, '1'))]),
                  ]
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array push method with multiple arguments', () => {
            const source = `
              [].push.apply([], [1, 2])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array unshift method with single argument', () => {
            const source = `
              [].unshift.apply([], [5])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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
                    callExpression(tableUnpack(), [
                      tableConstructor([
                        tableNoKeyField(numericLiteral(5, '5')),
                      ]),
                    ]),
                  ]
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array unshift method with multiple arguments', () => {
            const source = `
              [].unshift.apply([], [1, 2])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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
                    callExpression(tableUnpack(), [
                      tableConstructor([
                        tableNoKeyField(numericLiteral(1, '1')),
                        tableNoKeyField(numericLiteral(2, '2')),
                      ]),
                    ]),
                  ]
                )
              ),
            ]);

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array pop method with no argument', () => {
            const source = `
              [].pop.apply([])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });

          it('should handle array shift method with no argument', () => {
            const source = `
              [].shift.apply([])
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });
        });

        describe.each(arrayPolyfilledMethodNames)(
          'array polyfilled method: %s',
          (methodName) => {
            it('should handle simple call', () => {
              const source = `
              arr.${methodName}(1, 2)
            `;
              const given = getProgramNode(source);

              const expected = programWithUpstreamComment([
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

              expect(convertProgram(source, {}, given)).toEqual(expected);
            });

            it('should handle when using call', () => {
              const source = `
              arr.${methodName}.call(otherArr, 1, 2)
            `;
              const given = getProgramNode(source);

              const expected = programWithUpstreamComment([
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
                        identifier('otherArr'),
                        numericLiteral(1, '1'),
                        numericLiteral(2, '2'),
                      ]
                    ),
                    `ROBLOX CHECK: check if 'arr' is an Array`
                  )
                ),
              ]);

              expect(convertProgram(source, {}, given)).toEqual(expected);
            });

            it('should handle when using apply', () => {
              const source = `
              arr.${methodName}.apply(otherArr, [1, 2])
            `;
              const given = getProgramNode(source);

              const expected = programWithUpstreamComment([
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
                        identifier('otherArr'),
                        callExpression(tableUnpack(), [
                          tableConstructor([
                            tableNoKeyField(numericLiteral(1, '1')),
                            tableNoKeyField(numericLiteral(2, '2')),
                          ]),
                        ]),
                      ]
                    ),
                    `ROBLOX CHECK: check if 'arr' is an Array`
                  )
                ),
              ]);

              expect(convertProgram(source, {}, given)).toEqual(expected);
            });
          }
        );
      });

      describe.each(['reduceRight'])(
        'for unpolyfilled method: %s',
        (methodName) => {
          it('should not handle simple call', () => {
            const source = `
              arr.${methodName}(1, 2)
            `;
            const given = getProgramNode(source);

            const expected = programWithUpstreamComment([
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

            expect(convertProgram(source, {}, given)).toEqual(expected);
          });
        }
      );
    });
  });
});

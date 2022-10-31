import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  callExpression,
  functionDeclaration,
  functionParamName,
  functionReturnType,
  identifier,
  memberExpression,
  nilLiteral,
  nodeGroup,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeCastExpression,
  typeFunction,
  typeIntersection,
  typeLiteral,
  typePropertySignature,
  typeReference,
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
  describe('Class Declaration', () => {
    const source = '';

    describe('React Class', () => {
      it('convert simple PureComponent', () => {
        const given = getProgramNode(`
          class MyComponent extends React.PureComponent {
            render() {
                return null
            }
          }
        `);

        const expected = programWithUpstreamComment([
          nodeGroup([
            typeAliasDeclaration(
              identifier('MyComponent'),
              typeIntersection([
                typeReference(identifier('React_Component'), [
                  typeAny(),
                  typeAny(),
                ]),
                typeLiteral([]),
              ])
            ),
            nodeGroup([
              typeAliasDeclaration(
                identifier('MyComponent_statics'),
                typeLiteral([])
              ),
            ]),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('MyComponent'))],
              [
                variableDeclaratorValue(
                  typeCastExpression(
                    callExpression(
                      memberExpression(
                        memberExpression(
                          identifier('React'),
                          '.',
                          identifier('PureComponent')
                        ),
                        ':',
                        identifier('extend')
                      ),
                      [stringLiteral('MyComponent')]
                    ),
                    typeIntersection([
                      typeReference(identifier('MyComponent')),
                      typeReference(identifier('MyComponent_statics')),
                    ])
                  )
                ),
              ]
            ),
            nodeGroup([]),
            functionDeclaration(
              identifier('MyComponent.render'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([nodeGroup([returnStatement(nilLiteral())])]),
              undefined,
              false
            ),
          ]),
        ]);

        const actual = convertProgram(source, {}, given);

        expect(actual).toEqual(expected);
      });

      it('convert simple Component', () => {
        const given = getProgramNode(`
          class MyComponent extends React.Component {
            render() {
                return null
            }
          }
        `);

        const expected = programWithUpstreamComment([
          nodeGroup([
            typeAliasDeclaration(
              identifier('MyComponent'),
              typeIntersection([
                typeReference(identifier('React_Component'), [
                  typeAny(),
                  typeAny(),
                ]),
                typeLiteral([]),
              ])
            ),
            nodeGroup([
              typeAliasDeclaration(
                identifier('MyComponent_statics'),
                typeLiteral([])
              ),
            ]),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('MyComponent'))],
              [
                variableDeclaratorValue(
                  typeCastExpression(
                    callExpression(
                      memberExpression(
                        memberExpression(
                          identifier('React'),
                          '.',
                          identifier('Component')
                        ),
                        ':',
                        identifier('extend')
                      ),
                      [stringLiteral('MyComponent')]
                    ),
                    typeIntersection([
                      typeReference(identifier('MyComponent')),
                      typeReference(identifier('MyComponent_statics')),
                    ])
                  )
                ),
              ]
            ),
            nodeGroup([]),
            functionDeclaration(
              identifier('MyComponent.render'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([nodeGroup([returnStatement(nilLiteral())])]),
              undefined,
              false
            ),
          ]),
        ]);

        const actual = convertProgram(source, {}, given);

        expect(actual).toEqual(expected);
      });

      it('convert Component with constructor', () => {
        const given = getProgramNode(`
          class MyComponent extends React.Component {
            constructor() {
              this.state = { isActive: false };
            }
            render() {
              return null
            }
          }
        `);

        const expected = programWithUpstreamComment([
          nodeGroup([
            typeAliasDeclaration(
              identifier('MyComponent'),
              typeIntersection([
                typeReference(identifier('React_Component'), [
                  typeAny(),
                  typeAny(),
                ]),
                typeLiteral([]),
              ])
            ),
            nodeGroup([
              typeAliasDeclaration(
                identifier('MyComponent_statics'),
                typeLiteral([])
              ),
            ]),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('MyComponent'))],
              [
                variableDeclaratorValue(
                  typeCastExpression(
                    callExpression(
                      memberExpression(
                        memberExpression(
                          identifier('React'),
                          '.',
                          identifier('Component')
                        ),
                        ':',
                        identifier('extend')
                      ),
                      [stringLiteral('MyComponent')]
                    ),
                    typeIntersection([
                      typeReference(identifier('MyComponent')),
                      typeReference(identifier('MyComponent_statics')),
                    ])
                  )
                ),
              ]
            ),
            functionDeclaration(
              identifier('MyComponent.init'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [
                      memberExpression(
                        identifier('self'),
                        '.',
                        identifier('state')
                      ),
                    ],
                    [
                      tableConstructor([
                        tableNameKeyField(
                          identifier('isActive'),
                          booleanLiteral(false)
                        ),
                      ]),
                    ]
                  ),
                ]),
              ]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.render'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([nodeGroup([returnStatement(nilLiteral())])]),
              undefined,
              false
            ),
          ]),
        ]);

        const actual = convertProgram(source, {}, given);

        expect(actual).toEqual(expected);
      });

      it('convert Component with initialized property', () => {
        const given = getProgramNode(`
          class MyComponent extends React.Component {
            myProp = { isActive: false };
            render() {
                return null
            }
          }
        `);

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
          typeAliasDeclaration(
            identifier('Object'),
            typeReference(identifier('LuauPolyfill.Object'))
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('MyComponent'),
              typeIntersection([
                typeReference(identifier('React_Component'), [
                  typeAny(),
                  typeAny(),
                ]),
                typeLiteral([
                  typePropertySignature(
                    identifier('myProp'),
                    typeAnnotation(typeReference(identifier('Object')))
                  ),
                ]),
              ])
            ),
            nodeGroup([
              typeAliasDeclaration(
                identifier('MyComponent_statics'),
                typeLiteral([])
              ),
            ]),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('MyComponent'))],
              [
                variableDeclaratorValue(
                  typeCastExpression(
                    callExpression(
                      memberExpression(
                        memberExpression(
                          identifier('React'),
                          '.',
                          identifier('Component')
                        ),
                        ':',
                        identifier('extend')
                      ),
                      [stringLiteral('MyComponent')]
                    ),
                    typeIntersection([
                      typeReference(identifier('MyComponent')),
                      typeReference(identifier('MyComponent_statics')),
                    ])
                  )
                ),
              ]
            ),
            functionDeclaration(
              identifier('MyComponent.init'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      identifier('self'),
                      '.',
                      identifier('myProp')
                    ),
                  ],
                  [
                    tableConstructor([
                      tableNameKeyField(
                        identifier('isActive'),
                        booleanLiteral(false)
                      ),
                    ]),
                  ]
                ),
              ]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.render'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([nodeGroup([returnStatement(nilLiteral())])]),
              undefined,
              false
            ),
          ]),
        ]);

        const actual = convertProgram(source, {}, given);

        expect(actual).toEqual(expected);
      });

      it('convert Component with static method', () => {
        const given = getProgramNode(`
          class MyComponent extends React.Component {
            render() {
                return null
            }
            static staticMethod() {
              return {};
            }
          }
        `);

        const expected = programWithUpstreamComment([
          nodeGroup([
            typeAliasDeclaration(
              identifier('MyComponent'),
              typeIntersection([
                typeReference(identifier('React_Component'), [
                  typeAny(),
                  typeAny(),
                ]),
                typeLiteral([]),
              ])
            ),
            nodeGroup([
              typeAliasDeclaration(
                identifier('MyComponent_statics'),
                typeLiteral([])
              ),
            ]),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('MyComponent'))],
              [
                variableDeclaratorValue(
                  typeCastExpression(
                    callExpression(
                      memberExpression(
                        memberExpression(
                          identifier('React'),
                          '.',
                          identifier('Component')
                        ),
                        ':',
                        identifier('extend')
                      ),
                      [stringLiteral('MyComponent')]
                    ),
                    typeIntersection([
                      typeReference(identifier('MyComponent')),
                      typeReference(identifier('MyComponent_statics')),
                    ])
                  )
                ),
              ]
            ),
            nodeGroup([]),
            functionDeclaration(
              identifier('MyComponent.render'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([nodeGroup([returnStatement(nilLiteral())])]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.staticMethod'),
              [],
              nodeGroup([nodeGroup([returnStatement(tableConstructor())])]),
              undefined,
              false
            ),
          ]),
        ]);

        const actual = convertProgram(source, {}, given);

        expect(actual).toEqual(expected);
      });

      it('convert Component with static property', () => {
        const given = getProgramNode(`
          class MyComponent extends React.Component {
            static context = {};
            render() {
                return null
            }
          }
        `);

        const expected = programWithUpstreamComment([
          nodeGroup([
            typeAliasDeclaration(
              identifier('MyComponent'),
              typeIntersection([
                typeReference(identifier('React_Component'), [
                  typeAny(),
                  typeAny(),
                ]),
                typeLiteral([]),
              ])
            ),
            nodeGroup([
              typeAliasDeclaration(
                identifier('MyComponent_statics'),
                typeLiteral([])
              ),
            ]),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('MyComponent'))],
              [
                variableDeclaratorValue(
                  typeCastExpression(
                    callExpression(
                      memberExpression(
                        memberExpression(
                          identifier('React'),
                          '.',
                          identifier('Component')
                        ),
                        ':',
                        identifier('extend')
                      ),
                      [stringLiteral('MyComponent')]
                    ),
                    typeIntersection([
                      typeReference(identifier('MyComponent')),
                      typeReference(identifier('MyComponent_statics')),
                    ])
                  )
                ),
              ]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                memberExpression(
                  identifier('MyComponent'),
                  '.',
                  identifier('context')
                ),
              ],
              [tableConstructor()]
            ),
            nodeGroup([]),
            functionDeclaration(
              identifier('MyComponent.render'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([nodeGroup([returnStatement(nilLiteral())])]),
              undefined,
              false
            ),
          ]),
        ]);

        const actual = convertProgram(source, {}, given);

        expect(actual).toEqual(expected);
      });

      it('convert Component with lifecycle hooks', () => {
        const given = getProgramNode(`
          class MyComponent extends React.Component {
            constructor() {
              this.state = { isActive: false };
            }
            render() {
              return null
            }
            componentWillMount() {}
            componentDidMount() {}
            shouldComponentUpdate() {}
            componentWillUpdate() {}
            componentDidUpdate() {}
            componentWillUnmount() {}
            componentDidCatch() {}
          }
        `);

        const expected = programWithUpstreamComment([
          nodeGroup([
            typeAliasDeclaration(
              identifier('MyComponent'),
              typeIntersection([
                typeReference(identifier('React_Component'), [
                  typeAny(),
                  typeAny(),
                ]),
                typeLiteral([]),
              ])
            ),
            nodeGroup([
              typeAliasDeclaration(
                identifier('MyComponent_statics'),
                typeLiteral([])
              ),
            ]),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('MyComponent'))],
              [
                variableDeclaratorValue(
                  typeCastExpression(
                    callExpression(
                      memberExpression(
                        memberExpression(
                          identifier('React'),
                          '.',
                          identifier('Component')
                        ),
                        ':',
                        identifier('extend')
                      ),
                      [stringLiteral('MyComponent')]
                    ),
                    typeIntersection([
                      typeReference(identifier('MyComponent')),
                      typeReference(identifier('MyComponent_statics')),
                    ])
                  )
                ),
              ]
            ),
            functionDeclaration(
              identifier('MyComponent.init'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [
                      memberExpression(
                        identifier('self'),
                        '.',
                        identifier('state')
                      ),
                    ],
                    [
                      tableConstructor([
                        tableNameKeyField(
                          identifier('isActive'),
                          booleanLiteral(false)
                        ),
                      ]),
                    ]
                  ),
                ]),
              ]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.render'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([nodeGroup([returnStatement(nilLiteral())])]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.componentWillMount'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.componentDidMount'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.shouldComponentUpdate'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.componentWillUpdate'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.componentDidUpdate'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.componentWillUnmount'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.componentDidCatch'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([]),
              undefined,
              false
            ),
          ]),
        ]);

        const actual = convertProgram(source, {}, given);

        expect(JSON.stringify(actual, undefined, 2)).toEqual(
          JSON.stringify(expected, undefined, 2)
        );
      });

      it('convert Component with lifecycle hook and custom method', () => {
        const given = getProgramNode(`
          class MyComponent extends React.Component {
            constructor() {
              this.state = { isActive: false };
            }
            render() {
              return null
            }
            componentWillMount() {}
            myMethod() {}
          }
        `);

        const expected = programWithUpstreamComment([
          nodeGroup([
            typeAliasDeclaration(
              identifier('MyComponent'),
              typeIntersection([
                typeReference(identifier('React_Component'), [
                  typeAny(),
                  typeAny(),
                ]),
                typeLiteral([
                  typePropertySignature(
                    identifier('myMethod'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('self'),
                            typeReference(identifier('MyComponent'))
                          ),
                        ],
                        functionReturnType([typeAny()])
                      )
                    )
                  ),
                ]),
              ])
            ),
            nodeGroup([
              typeAliasDeclaration(
                identifier('MyComponent_statics'),
                typeLiteral([])
              ),
            ]),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('MyComponent'))],
              [
                variableDeclaratorValue(
                  typeCastExpression(
                    callExpression(
                      memberExpression(
                        memberExpression(
                          identifier('React'),
                          '.',
                          identifier('Component')
                        ),
                        ':',
                        identifier('extend')
                      ),
                      [stringLiteral('MyComponent')]
                    ),
                    typeIntersection([
                      typeReference(identifier('MyComponent')),
                      typeReference(identifier('MyComponent_statics')),
                    ])
                  )
                ),
              ]
            ),
            functionDeclaration(
              identifier('MyComponent.init'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [
                      memberExpression(
                        identifier('self'),
                        '.',
                        identifier('state')
                      ),
                    ],
                    [
                      tableConstructor([
                        tableNameKeyField(
                          identifier('isActive'),
                          booleanLiteral(false)
                        ),
                      ]),
                    ]
                  ),
                ]),
              ]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.render'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([nodeGroup([returnStatement(nilLiteral())])]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent.componentWillMount'),
              [
                identifier(
                  'self',
                  typeAnnotation(typeReference(identifier('MyComponent')))
                ),
              ],
              nodeGroup([]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('MyComponent:myMethod'),
              [],
              nodeGroup([]),
              undefined,
              false
            ),
          ]),
        ]);

        const actual = convertProgram(source, {}, given);

        expect(JSON.stringify(actual, undefined, 2)).toEqual(
          JSON.stringify(expected, undefined, 2)
        );
      });
    });
  });
});

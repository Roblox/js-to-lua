import {
  binaryExpression as babelBinaryExpression,
  blockStatement as babelBlockStatement,
  callExpression as babelCallExpression,
  expressionStatement as babelExpressionStatement,
  forStatement as babelForStatement,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  updateExpression as babelUpdateExpression,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import {
  blockStatement,
  booleanLiteral,
  nodeGroup,
  whileStatement,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createForStatementHandler } from './for-statement.handler';

const { mockNodeWithValueHandler } = testUtils;

describe('For Statement Handler', () => {
  const handleForStatement = createForStatementHandler(
    mockNodeWithValueHandler,
    mockNodeWithValueHandler,
    mockNodeWithValueHandler,
    { handler: mockNodeWithValueHandler, type: [] },
    { handler: mockNodeWithValueHandler, type: ['VariableDeclaration'] }
  );
  it('should handle basic for loop', () => {
    const given = babelForStatement(
      babelVariableDeclaration('let', [
        babelVariableDeclarator(babelIdentifier('i'), babelNumericLiteral(0)),
      ]),
      babelBinaryExpression('<', babelIdentifier('i'), babelNumericLiteral(10)),
      babelUpdateExpression('++', babelIdentifier('i')),
      babelBlockStatement([
        babelExpressionStatement(
          babelCallExpression(babelIdentifier('foo'), [babelIdentifier('i')])
        ),
      ])
    );

    const expected = blockStatement([
      mockNodeWithValue(
        babelVariableDeclaration('let', [
          babelVariableDeclarator(babelIdentifier('i'), babelNumericLiteral(0)),
        ])
      ),
      whileStatement(
        mockNodeWithValue(
          babelBinaryExpression(
            '<',
            babelIdentifier('i'),
            babelNumericLiteral(10)
          )
        ),
        [
          nodeGroup([
            mockNodeWithValue(
              babelExpressionStatement(
                babelCallExpression(babelIdentifier('foo'), [
                  babelIdentifier('i'),
                ])
              )
            ),
          ]),
          nodeGroup([
            mockNodeWithValue(
              babelUpdateExpression('++', babelIdentifier('i'))
            ),
          ]),
        ]
      ),
    ]);

    const handledGiven = handleForStatement.handler('', {}, given);
    expect(handledGiven).toEqual(expected);
  });

  it('should handle for statement with no variable declaration', () => {
    const given = babelForStatement(
      null,
      babelBinaryExpression('<', babelIdentifier('i'), babelNumericLiteral(10)),
      babelUpdateExpression('++', babelIdentifier('i')),
      babelBlockStatement([
        babelExpressionStatement(
          babelCallExpression(babelIdentifier('foo'), [babelIdentifier('i')])
        ),
      ])
    );

    const expected = whileStatement(
      mockNodeWithValue(
        babelBinaryExpression(
          '<',
          babelIdentifier('i'),
          babelNumericLiteral(10)
        )
      ),
      [
        nodeGroup([
          mockNodeWithValue(
            babelExpressionStatement(
              babelCallExpression(babelIdentifier('foo'), [
                babelIdentifier('i'),
              ])
            )
          ),
        ]),
        nodeGroup([
          mockNodeWithValue(babelUpdateExpression('++', babelIdentifier('i'))),
        ]),
      ]
    );

    const handledGiven = handleForStatement.handler('', {}, given);
    expect(handledGiven).toEqual(expected);
  });

  it('should handle for statement with no test node', () => {
    const given = babelForStatement(
      babelVariableDeclaration('let', [
        babelVariableDeclarator(babelIdentifier('i'), babelNumericLiteral(0)),
      ]),
      null,
      babelUpdateExpression('++', babelIdentifier('i')),
      babelBlockStatement([
        babelExpressionStatement(
          babelCallExpression(babelIdentifier('foo'), [babelIdentifier('i')])
        ),
      ])
    );

    const expected = blockStatement([
      mockNodeWithValue(
        babelVariableDeclaration('let', [
          babelVariableDeclarator(babelIdentifier('i'), babelNumericLiteral(0)),
        ])
      ),
      whileStatement(booleanLiteral(true), [
        nodeGroup([
          mockNodeWithValue(
            babelExpressionStatement(
              babelCallExpression(babelIdentifier('foo'), [
                babelIdentifier('i'),
              ])
            )
          ),
        ]),
        nodeGroup([
          mockNodeWithValue(babelUpdateExpression('++', babelIdentifier('i'))),
        ]),
      ]),
    ]);

    const handledGiven = handleForStatement.handler('', {}, given);
    expect(handledGiven).toEqual(expected);
  });

  it('should handle for statement with no update', () => {
    const given = babelForStatement(
      babelVariableDeclaration('let', [
        babelVariableDeclarator(babelIdentifier('i'), babelNumericLiteral(0)),
      ]),
      babelBinaryExpression('<', babelIdentifier('i'), babelNumericLiteral(10)),
      null,
      babelBlockStatement([
        babelExpressionStatement(
          babelCallExpression(babelIdentifier('foo'), [babelIdentifier('i')])
        ),
      ])
    );

    const expected = blockStatement([
      mockNodeWithValue(
        babelVariableDeclaration('let', [
          babelVariableDeclarator(babelIdentifier('i'), babelNumericLiteral(0)),
        ])
      ),
      whileStatement(
        mockNodeWithValue(
          babelBinaryExpression(
            '<',
            babelIdentifier('i'),
            babelNumericLiteral(10)
          )
        ),
        [
          nodeGroup([
            mockNodeWithValue(
              babelExpressionStatement(
                babelCallExpression(babelIdentifier('foo'), [
                  babelIdentifier('i'),
                ])
              )
            ),
          ]),
        ]
      ),
    ]);

    const handledGiven = handleForStatement.handler('', {}, given);
    expect(handledGiven).toEqual(expected);
  });

  it('should handle for statement with no variable declaration, no test case, and no update', () => {
    const given = babelForStatement(
      null,
      null,
      null,
      babelBlockStatement([
        babelExpressionStatement(
          babelCallExpression(babelIdentifier('foo'), [babelIdentifier('i')])
        ),
      ])
    );

    const expected = whileStatement(booleanLiteral(true), [
      nodeGroup([
        mockNodeWithValue(
          babelExpressionStatement(
            babelCallExpression(babelIdentifier('foo'), [babelIdentifier('i')])
          )
        ),
      ]),
    ]);

    const handledGiven = handleForStatement.handler('', {}, given);
    expect(handledGiven).toEqual(expected);
  });

  it('should handle for statement with a single statement, not array of statements, for the body', () => {
    const given = babelForStatement(
      babelVariableDeclaration('let', [
        babelVariableDeclarator(babelIdentifier('i'), babelNumericLiteral(0)),
      ]),
      babelBinaryExpression('<', babelIdentifier('i'), babelNumericLiteral(10)),
      babelUpdateExpression('++', babelIdentifier('i')),
      babelExpressionStatement(
        babelCallExpression(babelIdentifier('foo'), [babelIdentifier('i')])
      )
    );

    const expected = blockStatement([
      mockNodeWithValue(
        babelVariableDeclaration('let', [
          babelVariableDeclarator(babelIdentifier('i'), babelNumericLiteral(0)),
        ])
      ),
      whileStatement(
        mockNodeWithValue(
          babelBinaryExpression(
            '<',
            babelIdentifier('i'),
            babelNumericLiteral(10)
          )
        ),
        [
          nodeGroup([
            mockNodeWithValue(
              babelExpressionStatement(
                babelCallExpression(babelIdentifier('foo'), [
                  babelIdentifier('i'),
                ])
              )
            ),
          ]),
          nodeGroup([
            mockNodeWithValue(
              babelUpdateExpression('++', babelIdentifier('i'))
            ),
          ]),
        ]
      ),
    ]);

    const handledGiven = handleForStatement.handler('', {}, given);
    expect(handledGiven).toEqual(expected);
  });
});

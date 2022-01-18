import {
  nodeGroup,
  whileStatement,
  booleanLiteral,
} from '@js-to-lua/lua-types';
import { mockNodeWithValueHandler } from '../../testUtils/mock-node';
import { createForStatementHandler } from './for-statement.handler';
import {
  forStatement as babelForStatement,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  binaryExpression as babelBinaryExpression,
  updateExpression as babelUpdateExpression,
  blockStatement as babelBlockStatement,
  callExpression as babelCallExpression,
  expressionStatement as babelExpressionStatement,
} from '@babel/types';
import { mockNodeWithValue } from '../../testUtils/mock-node';

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

    const expected = nodeGroup([
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

    const expected = nodeGroup([
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

    const expected = nodeGroup([
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

    const expected = nodeGroup([
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

    const expected = nodeGroup([
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

    const expected = nodeGroup([
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

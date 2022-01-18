import {
  blockStatement,
  callExpression,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  nodeGroup,
  returnStatement,
  unaryNegationExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withInnerConversionComment,
} from '@js-to-lua/lua-types';
import { createTryStatementHandler } from './try-statement.handler';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import {
  blockStatement as babelBlockStatement,
  catchClause as babelCatchClause,
  identifier as babelIdentifier,
  tryStatement as babelTryStatement,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';

const source = '';

describe('Try Statement Handler', () => {
  const handleTryStatement = createTryStatementHandler(
    mockNodeWithValueHandler,
    mockNodeWithValueHandler,
    mockNodeWithValueHandler
  ).handler;

  it(`should handle try`, () => {
    const given = babelTryStatement(
      babelBlockStatement([
        babelVariableDeclaration('let', [
          babelVariableDeclarator(babelIdentifier('foo')),
        ]),
      ])
    );
    const expected = withInnerConversionComment(
      blockStatement([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(identifier('ok')),
            variableDeclaratorIdentifier(identifier('result')),
            variableDeclaratorIdentifier(identifier('hasReturned')),
          ],
          [
            variableDeclaratorValue(
              callExpression(identifier('pcall'), [
                functionExpression(
                  [],
                  nodeGroup([
                    mockNodeWithValue(
                      babelVariableDeclaration('let', [
                        babelVariableDeclarator(babelIdentifier('foo')),
                      ])
                    ),
                  ])
                ),
              ])
            ),
          ]
        ),
        ifStatement(
          ifClause(
            identifier('hasReturned'),
            nodeGroup([returnStatement(identifier('result'))])
          )
        ),
        ifStatement(
          ifClause(
            unaryNegationExpression(identifier('ok')),
            nodeGroup([
              callExpression(identifier('error'), [identifier('result')]),
            ])
          )
        ),
      ]),
      'ROBLOX COMMENT: try block conversion'
    );

    expect(handleTryStatement(source, {}, given)).toEqual(expected);
  });

  it(`should handle try-catch`, () => {
    const given = babelTryStatement(
      babelBlockStatement([
        babelVariableDeclaration('let', [
          babelVariableDeclarator(babelIdentifier('foo')),
        ]),
      ]),
      babelCatchClause(
        babelIdentifier('error'),
        babelBlockStatement([
          babelVariableDeclaration('let', [
            babelVariableDeclarator(babelIdentifier('bar')),
          ]),
        ])
      )
    );
    const expected = withInnerConversionComment(
      blockStatement([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(identifier('ok')),
            variableDeclaratorIdentifier(identifier('result')),
            variableDeclaratorIdentifier(identifier('hasReturned')),
          ],
          [
            variableDeclaratorValue(
              callExpression(identifier('xpcall'), [
                functionExpression(
                  [],
                  nodeGroup([
                    mockNodeWithValue(
                      babelVariableDeclaration('let', [
                        babelVariableDeclarator(babelIdentifier('foo')),
                      ])
                    ),
                  ])
                ),
                functionExpression(
                  [mockNodeWithValue(babelIdentifier('error'))],
                  nodeGroup([
                    mockNodeWithValue(
                      babelVariableDeclaration('let', [
                        babelVariableDeclarator(babelIdentifier('bar')),
                      ])
                    ),
                  ])
                ),
              ])
            ),
          ]
        ),
        ifStatement(
          ifClause(
            identifier('hasReturned'),
            nodeGroup([returnStatement(identifier('result'))])
          )
        ),
      ]),
      'ROBLOX COMMENT: try-catch block conversion'
    );

    expect(handleTryStatement(source, {}, given)).toEqual(expected);
  });

  it(`should handle try-finally`, () => {
    const given = babelTryStatement(
      babelBlockStatement([
        babelVariableDeclaration('let', [
          babelVariableDeclarator(babelIdentifier('foo')),
        ]),
      ]),
      undefined,
      babelBlockStatement([
        babelVariableDeclaration('let', [
          babelVariableDeclarator(babelIdentifier('bar')),
        ]),
      ])
    );
    const expected = withInnerConversionComment(
      blockStatement([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(identifier('ok')),
            variableDeclaratorIdentifier(identifier('result')),
            variableDeclaratorIdentifier(identifier('hasReturned')),
          ],
          [
            variableDeclaratorValue(
              callExpression(identifier('pcall'), [
                functionExpression(
                  [],
                  nodeGroup([
                    mockNodeWithValue(
                      babelVariableDeclaration('let', [
                        babelVariableDeclarator(babelIdentifier('foo')),
                      ])
                    ),
                  ])
                ),
              ])
            ),
          ]
        ),
        blockStatement([
          mockNodeWithValue(
            babelVariableDeclaration('let', [
              babelVariableDeclarator(babelIdentifier('bar')),
            ])
          ),
        ]),
        ifStatement(
          ifClause(
            identifier('hasReturned'),
            nodeGroup([returnStatement(identifier('result'))])
          )
        ),
        ifStatement(
          ifClause(
            unaryNegationExpression(identifier('ok')),
            nodeGroup([
              callExpression(identifier('error'), [identifier('result')]),
            ])
          )
        ),
      ]),
      'ROBLOX COMMENT: try-finally block conversion'
    );

    expect(handleTryStatement(source, {}, given)).toEqual(expected);
  });

  it(`should handle try-catch-finally`, () => {
    const given = babelTryStatement(
      babelBlockStatement([
        babelVariableDeclaration('let', [
          babelVariableDeclarator(babelIdentifier('foo')),
        ]),
      ]),
      babelCatchClause(
        babelIdentifier('error'),
        babelBlockStatement([
          babelVariableDeclaration('let', [
            babelVariableDeclarator(babelIdentifier('bar')),
          ]),
        ])
      ),
      babelBlockStatement([
        babelVariableDeclaration('let', [
          babelVariableDeclarator(babelIdentifier('baz')),
        ]),
      ])
    );
    const expected = withInnerConversionComment(
      blockStatement([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(identifier('ok')),
            variableDeclaratorIdentifier(identifier('result')),
            variableDeclaratorIdentifier(identifier('hasReturned')),
          ],
          [
            variableDeclaratorValue(
              callExpression(identifier('xpcall'), [
                functionExpression(
                  [],
                  nodeGroup([
                    mockNodeWithValue(
                      babelVariableDeclaration('let', [
                        babelVariableDeclarator(babelIdentifier('foo')),
                      ])
                    ),
                  ])
                ),
                functionExpression(
                  [mockNodeWithValue(babelIdentifier('error'))],
                  nodeGroup([
                    mockNodeWithValue(
                      babelVariableDeclaration('let', [
                        babelVariableDeclarator(babelIdentifier('bar')),
                      ])
                    ),
                  ])
                ),
              ])
            ),
          ]
        ),
        blockStatement([
          mockNodeWithValue(
            babelVariableDeclaration('let', [
              babelVariableDeclarator(babelIdentifier('baz')),
            ])
          ),
        ]),
        ifStatement(
          ifClause(
            identifier('hasReturned'),
            nodeGroup([returnStatement(identifier('result'))])
          )
        ),
      ]),
      'ROBLOX COMMENT: try-catch-finally block conversion'
    );

    expect(handleTryStatement(source, {}, given)).toEqual(expected);
  });
});

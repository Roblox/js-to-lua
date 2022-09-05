import {
  isClassDeclaration,
  withClassDeclarationExtra,
} from './with-class-declaration-extra';
import {
  callExpression,
  expressionStatement,
  identifier,
  nodeGroup,
  tableConstructor,
  typeAliasDeclaration,
  typeLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';

describe('With class declaration extra', () => {
  it('should return true when is proper class declaration', () => {
    const given = withClassDeclarationExtra(
      nodeGroup([
        typeAliasDeclaration(identifier('foo'), typeLiteral([])),
        nodeGroup([
          typeAliasDeclaration(identifier('bar'), typeLiteral([])),
          typeAliasDeclaration(identifier('fizz'), typeLiteral([])),
        ]),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('baz'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
      ])
    );
    expect(isClassDeclaration(given)).toBe(true);
  });

  it('should return true when is proper class declaration - without private type', () => {
    const given = withClassDeclarationExtra(
      nodeGroup([
        typeAliasDeclaration(identifier('foo'), typeLiteral([])),
        nodeGroup([typeAliasDeclaration(identifier('bar'), typeLiteral([]))]),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('baz'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
      ])
    );
    expect(isClassDeclaration(given)).toBe(true);
  });

  it('should return false when not enough node group members', () => {
    const given = withClassDeclarationExtra(
      nodeGroup([
        typeAliasDeclaration(identifier('foo'), typeLiteral([])),
        nodeGroup([typeAliasDeclaration(identifier('bar'), typeLiteral([]))]),
      ])
    );
    expect(isClassDeclaration(given)).toBe(false);
  });

  it('should return false when node group members in wrong order', () => {
    const given = withClassDeclarationExtra(
      nodeGroup([
        typeAliasDeclaration(identifier('foo'), typeLiteral([])),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('baz'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([typeAliasDeclaration(identifier('bar'), typeLiteral([]))]),
      ])
    );
    expect(isClassDeclaration(given)).toBe(false);
  });

  it('should return false when is empty LuaNodeGroup with declaration extra', () => {
    const given = withClassDeclarationExtra(nodeGroup([]));
    expect(isClassDeclaration(given)).toBe(false);
  });

  it.each([
    nodeGroup([]),
    withClassDeclarationExtra(
      expressionStatement(callExpression(identifier('foo'), []))
    ),
    expressionStatement(callExpression(identifier('foo'), [])),
  ])(
    'should return false when is NOT LuaNodeGroup with declaration extra',
    (given) => {
      expect(isClassDeclaration(given)).toBe(false);
    }
  );
});

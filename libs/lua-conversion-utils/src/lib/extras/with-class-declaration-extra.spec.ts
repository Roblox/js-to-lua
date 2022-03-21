import {
  isClassDeclaration,
  withClassDeclarationExtra,
} from './with-class-declaration-extra';
import {
  callExpression,
  expressionStatement,
  identifier,
  nodeGroup,
} from '@js-to-lua/lua-types';

describe('With class declaration extra', () => {
  it('should return true when is LuaNodeGroup with declaration extra', () => {
    const given = withClassDeclarationExtra(nodeGroup([]));
    expect(isClassDeclaration(given)).toBe(true);
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

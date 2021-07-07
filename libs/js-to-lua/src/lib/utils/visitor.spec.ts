import {
  functionDeclaration,
  identifier,
  LuaNode,
  program,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { visit, Visitor } from './visitor';

describe('Visitor', () => {
  it('should visit the empty program', () => {
    const visited = Array<LuaNode['type']>();
    const node = program([]);
    const visitor: Visitor = (node) => {
      visited.push(node.type);
    };

    visit(node, visitor);

    expect(visited).toEqual(['Program']);
  });

  it('should visit the program with statements', () => {
    const visited = Array<LuaNode['type']>();
    const node = program([
      functionDeclaration(identifier('foo')),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [variableDeclaratorValue(stringLiteral('baz'))]
      ),
    ]);
    const visitor: Visitor = (node) => {
      visited.push(node.type);
    };

    visit(node, visitor);
    const expected: Array<LuaNode['type']> = [
      'Program',
      'FunctionDeclaration',
      'Identifier',
      'VariableDeclaration',
      'VariableDeclaratorIdentifier',
      'Identifier',
      'VariableDeclaratorValue',
      'StringLiteral',
    ];

    expect(visited).toEqual(expected);
  });
});

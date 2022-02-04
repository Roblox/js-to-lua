import {
  functionDeclaration,
  identifier,
  isFunctionDeclaration,
  isIdentifier,
  isProgram,
  isStringLiteral,
  LuaNode,
  nodeGroup,
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

    const result = visit(node, visitor);

    expect(visited).toEqual(['Program']);
    expect(result).toEqual(program([]));
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

    const result = visit(node, visitor);
    const expected: Array<LuaNode['type']> = [
      'Program',
      'FunctionDeclaration',
      'Identifier',
      'NodeGroup',
      'VariableDeclaration',
      'VariableDeclaratorIdentifier',
      'Identifier',
      'VariableDeclaratorValue',
      'StringLiteral',
    ];

    expect(visited).toEqual(expected);
    expect(result).toEqual(
      program([
        functionDeclaration(identifier('foo')),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('bar'))],
          [variableDeclaratorValue(stringLiteral('baz'))]
        ),
      ])
    );
  });

  it('should not modify empty program', () => {
    const node = program([]);
    const visitor: Visitor = () => undefined;

    const result = visit(node, visitor);

    expect(result).toEqual(program([]));
  });

  it('should not modify program with statements', () => {
    const node = program([
      functionDeclaration(identifier('foo')),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [variableDeclaratorValue(stringLiteral('baz'))]
      ),
    ]);
    const visitor: Visitor = () => undefined;

    const result = visit(node, visitor);
    const expected = program([
      functionDeclaration(identifier('foo')),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [variableDeclaratorValue(stringLiteral('baz'))]
      ),
    ]);

    expect(result).toEqual(expected);
  });

  it('should append _ to all identifiers names and prepend _ to string literals', () => {
    const node = program([
      functionDeclaration(identifier('foo')),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [variableDeclaratorValue(stringLiteral('baz'))]
      ),
    ]);
    const visitor: Visitor = (node) => {
      if (isIdentifier(node)) {
        return {
          ...node,
          name: `${node.name}_`,
        };
      }
      if (isStringLiteral(node)) {
        return {
          ...node,
          value: `_${node.value}`,
        };
      }
    };

    const result = visit(node, visitor);
    const expected = program([
      functionDeclaration(identifier('foo_')),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar_'))],
        [variableDeclaratorValue(stringLiteral('_baz'))]
      ),
    ]);

    expect(result).toEqual(expected);
  });

  it('should replace function declaration with variable declaration', () => {
    const node = program([
      functionDeclaration(identifier('foo')),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [variableDeclaratorValue(stringLiteral('baz'))]
      ),
    ]);
    const visitor: Visitor = (node) => {
      if (isFunctionDeclaration(node)) {
        return variableDeclaration([variableDeclaratorIdentifier(node.id)], []);
      }
    };

    const result = visit(node, visitor);
    const expected = program([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        []
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [variableDeclaratorValue(stringLiteral('baz'))]
      ),
    ]);

    expect(result).toEqual(expected);
  });

  it('should replace program with node group', () => {
    const node = program([
      functionDeclaration(identifier('foo')),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [variableDeclaratorValue(stringLiteral('baz'))]
      ),
    ]);
    const visitor: Visitor = (node) => {
      if (isProgram(node)) {
        return nodeGroup([]);
      }
    };

    const result = visit(node, visitor);
    const expected = nodeGroup([]);

    expect(result).toEqual(expected);
  });
});

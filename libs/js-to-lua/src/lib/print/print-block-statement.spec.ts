import {
  blockStatement,
  expressionStatement,
  identifier,
  LuaBlockStatement,
  numericLiteral,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { printBlockStatement } from './print-node';
import dedent from '../testUtils/dedent';

describe('Print Block Statement', () => {
  it(`should print Block Statement Node with body`, () => {
    const given: LuaBlockStatement = blockStatement([]);
    const expected = dedent`
    do
    end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });

  it(`should print Block Statement Node with expressions`, () => {
    const given: LuaBlockStatement = blockStatement([
      expressionStatement(stringLiteral('hello')),
      expressionStatement(numericLiteral(1, '1')),
    ]);

    const expected = dedent`
    do
      "hello";
      1;
    end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });

  it(`should print nested block statements`, () => {
    const given: LuaBlockStatement = blockStatement([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('name'))],
        [variableDeclaratorValue(stringLiteral('wole'))]
      ),
      blockStatement([
        expressionStatement(stringLiteral('roblox')),
        expressionStatement(numericLiteral(1, '1')),
      ]),
    ]);

    const expected = dedent`
    do
      local name = "wole"
      do
      "roblox";
      1;
    end
    end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });

  it(`should print deeply nested block statements`, () => {
    const given: LuaBlockStatement = blockStatement([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('name'))],
        [variableDeclaratorValue(stringLiteral('wole'))]
      ),
      blockStatement([
        expressionStatement(stringLiteral('roblox')),
        expressionStatement(numericLiteral(1, '1')),
        blockStatement([expressionStatement(numericLiteral(1, '1'))]),
      ]),
    ]);
    const expected = dedent`
    do
      local name = "wole"
      do
      "roblox";
      1;
      do
      1;
    end
    end
    end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });
});

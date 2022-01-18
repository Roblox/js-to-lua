import {
  booleanLiteral,
  isBooleanLiteral,
  isLiteral,
  LuaBooleanLiteral,
  LuaLiteral,
  multilineStringLiteral,
  nilLiteral,
  numericLiteral,
  stringLiteral,
} from './literals';
import { isAnyNodeType, isNodeType } from './node.types';
import { LuaNode } from './lua-nodes.types';
import { LuaIdentifier, isIdentifier, identifier } from './expression';
import { callExpression, functionExpression } from './lua-nodes.creators';

import { LuaStringLiteral } from './literals';
import { nodeGroup } from './statement';

describe('isNodeType', () => {
  [
    {
      givenValues: [
        booleanLiteral(true),
        numericLiteral(1),
        multilineStringLiteral('foo'),
        nilLiteral(),
        identifier('foo'),
      ],
      sut: isNodeType<LuaStringLiteral>('StringLiteral'),
      sutName: 'StringLiteral',
    },
    {
      givenValues: [
        booleanLiteral(true),
        numericLiteral(1),
        multilineStringLiteral('foo'),
        nilLiteral(),
        stringLiteral('abc'),
      ],
      sut: isNodeType<LuaIdentifier>('Identifier'),
      sutName: 'Identifier',
    },
  ].forEach(({ givenValues, sut, sutName }) => {
    givenValues.forEach((given: LuaNode) => {
      it(`should return false when checking for ${sutName}`, () => {
        expect(sut(given)).toBe(false);
      });
    });
  });

  [
    {
      given: stringLiteral('abc'),
      sut: isNodeType<LuaStringLiteral>('StringLiteral'),
      sutName: 'StringLiteral',
    },
    {
      given: identifier('foo'),
      sut: isNodeType<LuaIdentifier>('Identifier'),
      sutName: 'Identifier',
    },
  ].forEach(({ given, sut, sutName }) => {
    it(`should return true when checking for ${sutName}`, () => {
      expect(sut(given)).toBe(true);
    });
  });
});

describe('isAnyNodeType', () => {
  [
    {
      givenValues: [
        booleanLiteral(true),
        numericLiteral(1),
        multilineStringLiteral('foo'),
        nilLiteral(),
        identifier('foo'),
      ],
      sut: isAnyNodeType([]),
      sutName: '<empty array>',
    },
    {
      givenValues: [
        numericLiteral(1),
        multilineStringLiteral('foo'),
        nilLiteral(),
        stringLiteral('abc'),
      ],
      sut: isAnyNodeType<LuaBooleanLiteral | LuaIdentifier>([
        isBooleanLiteral,
        isIdentifier,
      ]),
      sutName: 'BooleanLiteral or Identifier',
    },
    {
      givenValues: [
        identifier('foo'),
        callExpression(functionExpression([], nodeGroup([])), []),
      ],
      sut: isLiteral,
      sutName: 'Literal',
    },
  ].forEach(({ givenValues, sut, sutName }) => {
    givenValues.forEach((given: LuaNode) => {
      it(`should return false when checking for ${sutName}`, () => {
        expect(sut(given)).toBe(false);
      });
    });
  });

  [
    {
      givenValues: [
        booleanLiteral(true),
        booleanLiteral(false),
        identifier('foo'),
        identifier('bar'),
      ],
      sut: isAnyNodeType<LuaBooleanLiteral | LuaIdentifier>([
        isBooleanLiteral,
        isIdentifier,
      ]),
      sutName: 'BooleanLiteral or Identifier',
    },
    {
      givenValues: [
        booleanLiteral(true),
        numericLiteral(1),
        multilineStringLiteral('foo'),
        stringLiteral('abc'),
        nilLiteral(),
        identifier('foo'),
      ],
      sut: isAnyNodeType<LuaLiteral | LuaIdentifier>([isLiteral, isIdentifier]),
      sutName: 'Lua Literal or Identifier',
    },
  ].forEach(({ givenValues, sut, sutName }) => {
    givenValues.forEach((given) => {
      it(`should return true when checking for ${sutName}`, () => {
        expect(sut(given)).toBe(true);
      });
    });
  });
});

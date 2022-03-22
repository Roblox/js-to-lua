import { withExtras } from '@js-to-lua/lua-conversion-utils';
import {
  elseClause,
  elseifClause,
  identifier,
  ifClause,
  ifStatement,
  isIdentifier,
  isIfStatement,
  isNodeGroup,
  LuaNode,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { createPrintIfStatement } from './print-if-statement';

const printNode = jest.fn((node) => node.type);
const printIfStatement = createPrintIfStatement(printNode);

describe('Print if expression', () => {
  beforeEach(() => {
    const mockImpl = (node: LuaNode): string =>
      node.extras?.empty
        ? ''
        : isIfStatement(node)
        ? printIfStatement(node)
        : isIdentifier(node)
        ? node.name
        : isNodeGroup(node) && node.body.length
        ? node.body.map(mockImpl).join('\n')
        : node.type;

    printNode.mockReset();
    printNode.mockImplementation(mockImpl);
  });

  it('should print if statement', () => {
    const given = ifStatement(ifClause(identifier('foo'), nodeGroup([])));

    const expected = dedent`
    if foo then
    NodeGroup
    end`;

    expect(printIfStatement(given)).toEqual(expected);
  });

  it('should print if..then..else statement with empty elseif', () => {
    const given = ifStatement(
      ifClause(identifier('foo'), nodeGroup([])),
      [],
      elseClause(nodeGroup([]))
    );

    const expected = dedent`
    if foo then
    NodeGroup
    else
    NodeGroup
    end`;

    expect(printIfStatement(given)).toEqual(expected);
  });

  it('should print if..then..elseif..else statement with one elseif', () => {
    const given = ifStatement(
      ifClause(identifier('foo'), nodeGroup([])),
      [elseifClause(identifier('bar'), nodeGroup([]))],
      elseClause(nodeGroup([]))
    );

    const expected = dedent`
    if foo then
    NodeGroup
    elseif bar then
    NodeGroup
    else
    NodeGroup
    end`;

    expect(printIfStatement(given)).toEqual(expected);
  });

  it('should print if..then..elseif..else statement with multiple elseif', () => {
    const given = ifStatement(
      ifClause(identifier('foo'), nodeGroup([])),
      [
        elseifClause(identifier('bar'), nodeGroup([])),
        elseifClause(identifier('baz'), nodeGroup([])),
        elseifClause(identifier('fizz'), nodeGroup([])),
      ],
      elseClause(nodeGroup([]))
    );

    const expected = dedent`
    if foo then
    NodeGroup
    elseif bar then
    NodeGroup
    elseif baz then
    NodeGroup
    elseif fizz then
    NodeGroup
    else
    NodeGroup
    end`;

    expect(printIfStatement(given)).toEqual(expected);
  });

  it('should print if..then..elseif..else statement with nested if..then..else', () => {
    const given = ifStatement(
      ifClause(identifier('foo'), nodeGroup([])),
      [
        elseifClause(
          identifier('bar'),
          nodeGroup([
            ifStatement(
              ifClause(identifier('barInner'), nodeGroup([])),
              [
                elseifClause(identifier('bazInner'), nodeGroup([])),
                elseifClause(identifier('fizzInner'), nodeGroup([])),
              ],
              elseClause(nodeGroup([]))
            ),
          ])
        ),
        elseifClause(identifier('baz'), nodeGroup([])),
        elseifClause(identifier('fizz'), nodeGroup([])),
      ],
      elseClause(nodeGroup([]))
    );

    const expected = dedent`
    if foo then
    NodeGroup
    elseif bar then
    if barInner then
    NodeGroup
    elseif bazInner then
    NodeGroup
    elseif fizzInner then
    NodeGroup
    else
    NodeGroup
    end
    elseif baz then
    NodeGroup
    elseif fizz then
    NodeGroup
    else
    NodeGroup
    end`;

    expect(printIfStatement(given)).toEqual(expected);
  });

  it('should print if..then..elseif..else statement with multiple elseif and empty body', () => {
    const withEmptyExtras = withExtras({ empty: true });
    const given = ifStatement(
      ifClause(identifier('foo'), withEmptyExtras(nodeGroup([]))),
      [
        elseifClause(identifier('bar'), withEmptyExtras(nodeGroup([]))),
        elseifClause(identifier('baz'), withEmptyExtras(nodeGroup([]))),
        elseifClause(identifier('fizz'), withEmptyExtras(nodeGroup([]))),
      ],
      elseClause(withEmptyExtras(nodeGroup([])))
    );

    const expected = dedent`
    if foo then
    elseif bar then
    elseif baz then
    elseif fizz then
    else
    end`;

    expect(printIfStatement(given)).toEqual(expected);
  });
});

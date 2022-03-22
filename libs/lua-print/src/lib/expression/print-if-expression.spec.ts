import {
  elseExpressionClause,
  elseifExpressionClause,
  identifier,
  ifElseExpression,
  ifExpression,
  ifExpressionClause,
  isIdentifier,
  isIfExpression,
  LuaNode,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { createPrintIfExpression } from './print-if-expression';

const printNode = jest.fn((node) => node.type);
const printIfExpression = createPrintIfExpression(printNode);

describe('Print if expression', () => {
  beforeEach(() => {
    printNode.mockReset();
    printNode.mockImplementation((node: LuaNode) =>
      isIfExpression(node)
        ? printIfExpression(node)
        : isIdentifier(node)
        ? node.name
        : node.type
    );
  });

  it('should print if..then..else expression', () => {
    const given = ifElseExpression(
      ifExpressionClause(identifier('foo'), identifier('bar')),
      elseExpressionClause(identifier('baz'))
    );

    const expected = dedent`
    if foo
    then bar
    else baz`;

    expect(printIfExpression(given)).toEqual(expected);
  });

  it('should print if..then..elseif..else expression with empty elseif', () => {
    const given = ifExpression(
      ifExpressionClause(identifier('foo'), identifier('bar')),
      [],
      elseExpressionClause(identifier('baz'))
    );

    const expected = dedent`
    if foo
    then bar
    else baz`;

    expect(printIfExpression(given)).toEqual(expected);
  });

  it('should print if..then..elseif..else expression with one elseif', () => {
    const given = ifExpression(
      ifExpressionClause(identifier('foo'), identifier('fooBody')),
      [elseifExpressionClause(identifier('bar'), identifier('barBody'))],
      elseExpressionClause(identifier('baz'))
    );

    const expected = dedent`
    if foo
    then fooBody
    elseif bar
    then barBody
    else baz`;

    expect(printIfExpression(given)).toEqual(expected);
  });

  it('should print if..then..elseif..else expression with multiple elseif', () => {
    const given = ifExpression(
      ifExpressionClause(identifier('foo'), identifier('fooBody')),
      [
        elseifExpressionClause(identifier('bar'), identifier('barBody')),
        elseifExpressionClause(identifier('baz'), identifier('bazBody')),
        elseifExpressionClause(identifier('fizz'), identifier('fizzBody')),
      ],
      elseExpressionClause(identifier('buzz'))
    );

    const expected = dedent`
    if foo
    then fooBody
    elseif bar
    then barBody
    elseif baz
    then bazBody
    elseif fizz
    then fizzBody
    else buzz`;

    expect(printIfExpression(given)).toEqual(expected);
  });

  it('should print if..then..elseif..else expression with nested if..then..else', () => {
    const given = ifExpression(
      ifExpressionClause(identifier('foo'), identifier('fooBody')),
      [
        elseifExpressionClause(
          identifier('bar'),
          ifExpression(
            ifExpressionClause(
              identifier('barInner'),
              identifier('barInnerBody')
            ),
            [
              elseifExpressionClause(
                identifier('bazInner'),
                identifier('bazInnerBody')
              ),
              elseifExpressionClause(
                identifier('fizzInner'),
                identifier('fizzInnerBody')
              ),
            ],
            elseExpressionClause(identifier('barBody'))
          )
        ),
      ],
      elseExpressionClause(identifier('buzz'))
    );

    const expected = dedent`
    if foo
    then fooBody
    elseif bar
    then if barInner
    then barInnerBody
    elseif bazInner
    then bazInnerBody
    elseif fizzInner
    then fizzInnerBody
    else barBody
    else buzz`;

    expect(printIfExpression(given)).toEqual(expected);
  });
});

import { withInnerConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  expressionStatement,
  identifier,
  nodeGroup,
  stringLiteral,
  whileStatement,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { printNode } from '../print-node';

describe('Print while statement', () => {
  it('should print with empty body', () => {
    const given = whileStatement(identifier('cond'));
    const expected = dedent`
    while cond do
    end`;

    expect(printNode(given).toString()).toEqual(expected);
  });

  it('should print with non-empty body', () => {
    const given = whileStatement(identifier('cond'), [
      nodeGroup([
        expressionStatement(
          callExpression(identifier('print'), [stringLiteral('foo')])
        ),
      ]),
    ]);
    const expected = dedent`
    while cond do
    \tprint("foo");
    end`;

    expect(printNode(given).toString()).toEqual(expected);
  });

  it('should print with empty body and inner comment', () => {
    const given = withInnerConversionComment(
      whileStatement(identifier('cond')),
      'conversion comment'
    );
    const expected = dedent`
    while cond do --[[ conversion comment ]]
    end`;

    expect(printNode(given).toString()).toEqual(expected);
  });

  it('should print with empty non-body and inner comment', () => {
    const given = withInnerConversionComment(
      whileStatement(identifier('cond'), [
        nodeGroup([
          expressionStatement(
            callExpression(identifier('print'), [stringLiteral('foo')])
          ),
        ]),
      ]),
      'conversion comment'
    );
    const expected = dedent`
    while cond do --[[ conversion comment ]]
    \tprint("foo");
    end`;

    expect(printNode(given).toString()).toEqual(expected);
  });
});

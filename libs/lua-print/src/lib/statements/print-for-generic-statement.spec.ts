import { withInnerConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  expressionStatement,
  forGenericStatement,
  identifier,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { printNode } from '../print-node';

describe('Print for generic statement', () => {
  it('should print with empty body', () => {
    const given = forGenericStatement(
      [identifier('foo')],
      [identifier('iter')]
    );
    const expected = dedent`
    for foo in iter do
    end`;

    expect(printNode(given).toString()).toEqual(expected);
  });

  it('should print with non-empty body', () => {
    const given = forGenericStatement(
      [identifier('foo')],
      [identifier('iter')],
      [
        expressionStatement(
          callExpression(identifier('print'), [stringLiteral('foo')])
        ),
      ]
    );
    const expected = dedent`
    for foo in iter do
    \tprint("foo");
    end`;

    expect(printNode(given).toString()).toEqual(expected);
  });

  it('should print with empty body and inner comment', () => {
    const given = withInnerConversionComment(
      forGenericStatement([identifier('foo')], [identifier('iter')]),
      'conversion comment'
    );
    const expected = dedent`
    for foo in iter do --[[ conversion comment ]]
    end`;

    expect(printNode(given).toString()).toEqual(expected);
  });

  it('should print with empty non-body and inner comment', () => {
    const given = withInnerConversionComment(
      forGenericStatement(
        [identifier('foo')],
        [identifier('iter')],
        [
          expressionStatement(
            callExpression(identifier('print'), [stringLiteral('foo')])
          ),
        ]
      ),
      'conversion comment'
    );
    const expected = dedent`
    for foo in iter do --[[ conversion comment ]]
    \tprint("foo");
    end`;

    expect(printNode(given).toString()).toEqual(expected);
  });
});

import {
  callExpression,
  expressionStatement,
  forGenericStatement,
  identifier,
  stringLiteral,
  withInnerConversionComment,
} from '@js-to-lua/lua-types';
import { printNode } from '../print-node';
import dedent from '../../testUtils/dedent';

describe('Print for generic statement', () => {
  it('should print with empty body', () => {
    const given = forGenericStatement(
      [identifier('foo')],
      [identifier('iter')]
    );
    const expected = dedent`
    for foo in iter do
    end`;

    expect(printNode(given)).toEqual(expected);
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
    \tprint("foo")
    end`;

    expect(printNode(given)).toEqual(expected);
  });

  it('should print with empty body and inner comment', () => {
    const given = withInnerConversionComment(
      forGenericStatement([identifier('foo')], [identifier('iter')]),
      'conversion comment'
    );
    const expected = dedent`
    for foo in iter do --[[ conversion comment ]]
    end`;

    expect(printNode(given)).toEqual(expected);
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
    \tprint("foo")
    end`;

    expect(printNode(given)).toEqual(expected);
  });
});

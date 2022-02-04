import { withInnerConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  expressionStatement,
  identifier,
  repeatStatement,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { printNode } from '../print-node';

describe('Print repeat statement', () => {
  it('should print with empty body', () => {
    const given = repeatStatement(identifier('cond'));
    const expected = dedent`
    repeat
    until cond`;

    expect(printNode(given)).toEqual(expected);
  });

  it('should print with non-empty body', () => {
    const given = repeatStatement(identifier('cond'), [
      expressionStatement(
        callExpression(identifier('print'), [stringLiteral('foo')])
      ),
    ]);
    const expected = dedent`
    repeat
    \tprint("foo");
    until cond`;

    expect(printNode(given)).toEqual(expected);
  });

  it('should print with empty body and inner comment', () => {
    const given = withInnerConversionComment(
      repeatStatement(identifier('cond')),
      'conversion comment'
    );
    const expected = dedent`
    repeat --[[ conversion comment ]]
    until cond`;

    expect(printNode(given)).toEqual(expected);
  });

  it('should print with empty non-body and inner comment', () => {
    const given = withInnerConversionComment(
      repeatStatement(identifier('cond'), [
        expressionStatement(
          callExpression(identifier('print'), [stringLiteral('foo')])
        ),
      ]),
      'conversion comment'
    );
    const expected = dedent`
    repeat --[[ conversion comment ]]
    \tprint("foo");
    until cond`;

    expect(printNode(given)).toEqual(expected);
  });
});

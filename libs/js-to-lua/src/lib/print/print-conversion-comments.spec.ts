import {
  unhandledExpression,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { printNode } from './print-node';

describe('Print conversion comment', () => {
  it('should print conversion comment', () => {
    const given = withConversionComment(
      unhandledExpression(),
      'some simple comment'
    );
    const expected = `error("not implemented") --[[ some simple comment ]]`;

    expect(printNode(given)).toEqual(expected);
  });

  it('should print conversion comment with [[ inside', () => {
    const given = withConversionComment(
      unhandledExpression(),
      'some comment with [['
    );
    const expected = `error("not implemented") --[=[ some comment with [[ ]=]`;

    expect(printNode(given)).toEqual(expected);
  });

  it('should print conversion comment with ]] inside', () => {
    const given = withConversionComment(
      unhandledExpression(),
      'some comment with ]]'
    );
    const expected = `error("not implemented") --[=[ some comment with ]] ]=]`;

    expect(printNode(given)).toEqual(expected);
  });

  it('should print conversion comment with [[ and ]] inside', () => {
    const given = withConversionComment(
      unhandledExpression(),
      'some [[ comment ]]'
    );
    const expected = `error("not implemented") --[=[ some [[ comment ]] ]=]`;

    expect(printNode(given)).toEqual(expected);
  });

  it('should print conversion comment with [=[ and ]=] inside', () => {
    const given = withConversionComment(
      unhandledExpression(),
      'some [=[ comment ]=]'
    );
    const expected = `error("not implemented") --[[ some [=[ comment ]=] ]]`;

    expect(printNode(given)).toEqual(expected);
  });
});
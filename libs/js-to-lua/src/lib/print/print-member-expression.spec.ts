import {
  identifier,
  memberExpression,
  numericLiteral,
  tableConstructor,
  tableNoKeyField,
  unhandledExpression,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { printNode } from './print-node';

describe('Print Member Expression', () => {
  it('should print member expression with two identifiers', () => {
    const given = memberExpression(identifier('foo'), '.', identifier('bar'));
    const expected = `foo.bar`;

    expect(printNode(given)).toEqual(expected);
  });

  it('should print member expression with table constructor and identifier', () => {
    const given = memberExpression(
      tableConstructor([
        tableNoKeyField(numericLiteral(1)),
        tableNoKeyField(numericLiteral(2)),
      ]),
      '.',
      identifier('foo')
    );
    const expected = `({1, 2}).foo`;

    expect(printNode(given)).toEqual(expected);
  });

  it('should print member expression with unhandled node and identifier', () => {
    const given = memberExpression(
      withTrailingConversionComment(
        unhandledExpression(),
        'some conversion comment'
      ),
      '.',
      identifier('foo')
    );
    const expected = `(error("not implemented") --[[ some conversion comment ]]).foo`;

    expect(printNode(given)).toEqual(expected);
  });
});

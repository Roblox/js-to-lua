import {
  identifier,
  LuaCallExpression,
  LuaIdentifier,
  LuaMemberExpression,
} from '@js-to-lua/lua-types';
import {
  dateTimeIdentifier,
  dateTimeMethod,
  dateTimeMethodCall,
  dateTimeMethodIdentifier,
} from './date-time.creators';

describe('DateTime creators', () => {
  const methodNames = ['now'] as const;

  it.each(methodNames)(
    'should create DateTime method identifier: `%s` ',
    function (methodName) {
      expect(dateTimeMethodIdentifier(methodName)).toEqual({
        type: 'Identifier',
        name: methodName,
      } as LuaIdentifier);
    }
  );

  it('should create DateTime identifier', () => {
    expect(dateTimeIdentifier()).toEqual({
      type: 'Identifier',
      name: 'DateTime',
    } as LuaIdentifier);
  });

  it.each(methodNames)('should create DateTime method: `%s`', (methodName) => {
    expect(dateTimeMethod(methodName)).toEqual({
      type: 'LuaMemberExpression',
      indexer: '.',
      base: dateTimeIdentifier(),
      identifier: dateTimeMethodIdentifier(methodName),
    } as LuaMemberExpression);
  });

  it.each(methodNames)(
    'should create DateTime method call: `%s`',
    (methodName) => {
      expect(
        dateTimeMethodCall(methodName, identifier('foo'), identifier('bar'))
      ).toEqual({
        type: 'CallExpression',
        callee: dateTimeMethod(methodName),
        arguments: [identifier('foo'), identifier('bar')],
      } as LuaCallExpression);
    }
  );
});

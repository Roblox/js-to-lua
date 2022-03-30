import {
  identifier,
  LuaCallExpression,
  LuaIdentifier,
  LuaMemberExpression,
} from '@js-to-lua/lua-types';
import {
  tableIdentifier,
  tableInsert,
  tableInsertCall,
  tableMethod,
  tableMethodIdentifier,
  tablePack,
  tablePackCall,
  tableUnpack,
} from './table.creators';

describe('Table creators', () => {
  const methodNames = ['pack', 'unpack', 'insert'] as const;

  it.each(methodNames)(
    'should create table method identifier: `%s`',
    (methodName) => {
      expect(tableMethodIdentifier(methodName)).toEqual({
        type: 'Identifier',
        name: methodName,
      } as LuaIdentifier);
    }
  );

  it('should create table identifier', () => {
    expect(tableIdentifier()).toEqual({
      type: 'Identifier',
      name: 'table',
    } as LuaIdentifier);
  });

  it.each(methodNames)('should create table method: `%s`', (methodName) => {
    expect(tableMethod(methodName)).toEqual({
      type: 'LuaMemberExpression',
      indexer: '.',
      base: tableIdentifier(),
      identifier: tableMethodIdentifier(methodName),
    } as LuaMemberExpression);
  });

  it('should create table pack method', function () {
    expect(tablePack()).toEqual({
      type: 'LuaMemberExpression',
      indexer: '.',
      base: tableIdentifier(),
      identifier: tableMethodIdentifier('pack'),
    } as LuaMemberExpression);
  });

  it('should create table unpack method', function () {
    expect(tableUnpack()).toEqual({
      type: 'LuaMemberExpression',
      indexer: '.',
      base: tableIdentifier(),
      identifier: tableMethodIdentifier('unpack'),
    } as LuaMemberExpression);
  });

  it('should create table insert method', function () {
    expect(tableInsert()).toEqual({
      type: 'LuaMemberExpression',
      indexer: '.',
      base: tableIdentifier(),
      identifier: tableMethodIdentifier('insert'),
    } as LuaMemberExpression);
  });

  it('should create table pack method call', function () {
    expect(tablePackCall(identifier('foo'), identifier('bar'))).toEqual({
      type: 'CallExpression',
      callee: tablePack(),
      arguments: [identifier('foo'), identifier('bar')],
    } as LuaCallExpression);
  });

  it('should create table insert method call', function () {
    expect(tableInsertCall(identifier('foo'), identifier('bar'))).toEqual({
      type: 'CallExpression',
      callee: tableInsert(),
      arguments: [identifier('foo'), identifier('bar')],
    } as LuaCallExpression);
  });

  it('should create table pack method call', function () {
    expect(tablePackCall(identifier('foo'), identifier('bar'))).toEqual({
      type: 'CallExpression',
      callee: tablePack(),
      arguments: [identifier('foo'), identifier('bar')],
    } as LuaCallExpression);
  });
});

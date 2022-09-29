import { testUtils } from '@js-to-lua/handler-utils';
import {
  callExpression,
  identifier,
  indexExpression,
  memberExpression,
  stringLiteral,
} from '@js-to-lua/lua-types';
import * as assert from 'assert';
import { isRequire } from '../utils';
import { changeRequire, renameNestedImport, renameSimpleImport } from './utils';

describe('changeRequire', () => {
  it('should return a new require node', () => {
    const given = callExpression(identifier('require'), [
      identifier('somePackage'),
    ]);
    const expected = callExpression(identifier('require'), [
      identifier('anotherPackage'),
    ]);

    // narrowing TS type
    assert(isRequire(given));

    expect(changeRequire(identifier('anotherPackage'))(given)).toEqual(
      expected
    );
  });
  it('should return a new require node and keep comments', () => {
    const given = testUtils.withLuaComments(
      callExpression(identifier('require'), [identifier('somePackage')])
    );
    const expected = testUtils.withLuaComments(
      callExpression(identifier('require'), [identifier('anotherPackage')])
    );

    // narrowing TS type
    assert(isRequire(given));

    expect(changeRequire(identifier('anotherPackage'))(given)).toEqual(
      expected
    );
  });
});
describe('renameSimpleImport', () => {
  it.each([
    callExpression(identifier('require'), [
      memberExpression(identifier('Packages'), '.', identifier('Foo')),
    ]),
    callExpression(identifier('require'), [
      indexExpression(identifier('Packages'), stringLiteral('Foo')),
    ]),
  ])('should return true for matching simple import', (given) => {
    const rename = renameSimpleImport('Foo', 'Bar');

    // narrowing TS type
    assert(isRequire(given));

    expect(rename.test(given)).toBe(true);
  });

  it.each([
    callExpression(identifier('require'), [
      memberExpression(
        identifier('Packages'),
        '.',
        identifier('FooNonMatching')
      ),
    ]),
    callExpression(identifier('require'), [
      indexExpression(identifier('Packages'), stringLiteral('FooNonMatching')),
    ]),
  ])('should return false for non matching simple import', (given) => {
    const rename = renameSimpleImport('Foo', 'Bar');

    // narrowing TS type
    assert(isRequire(given));

    expect(rename.test(given)).toBe(false);
  });
});

describe('renameNestedImport', () => {
  it.each([
    callExpression(identifier('require'), [
      memberExpression(
        memberExpression(identifier('Packages'), '.', identifier('Foo')),
        '.',
        identifier('Bar')
      ),
    ]),
    callExpression(identifier('require'), [
      memberExpression(
        indexExpression(identifier('Packages'), stringLiteral('Foo')),
        '.',
        identifier('Bar')
      ),
    ]),
    callExpression(identifier('require'), [
      indexExpression(
        indexExpression(identifier('Packages'), stringLiteral('Foo')),
        stringLiteral('Bar')
      ),
    ]),
    callExpression(identifier('require'), [
      indexExpression(
        memberExpression(identifier('Packages'), '.', identifier('Foo')),
        stringLiteral('Bar')
      ),
    ]),
  ])('should return true for matching nested import', (given) => {
    const rename = renameNestedImport(['Foo', 'Bar'], 'Fizz');

    // narrowing TS type
    assert(isRequire(given));

    expect(rename.test(given)).toBe(true);
  });

  it.each([
    callExpression(identifier('require'), [
      memberExpression(
        memberExpression(identifier('Packages'), '.', identifier('NotFoo')),
        '.',
        identifier('Bar')
      ),
    ]),
    callExpression(identifier('require'), [
      memberExpression(
        indexExpression(identifier('Packages'), stringLiteral('NotFoo')),
        '.',
        identifier('Bar')
      ),
    ]),
    callExpression(identifier('require'), [
      indexExpression(
        indexExpression(identifier('Packages'), stringLiteral('NotFoo')),
        stringLiteral('Bar')
      ),
    ]),
    callExpression(identifier('require'), [
      indexExpression(
        memberExpression(identifier('Packages'), '.', identifier('NotFoo')),
        stringLiteral('Bar')
      ),
    ]),
    callExpression(identifier('require'), [
      memberExpression(
        memberExpression(identifier('Packages'), '.', identifier('Foo')),
        '.',
        identifier('NotBar')
      ),
    ]),
    callExpression(identifier('require'), [
      memberExpression(
        indexExpression(identifier('Packages'), stringLiteral('Foo')),
        '.',
        identifier('NotBar')
      ),
    ]),
    callExpression(identifier('require'), [
      indexExpression(
        indexExpression(identifier('Packages'), stringLiteral('Foo')),
        stringLiteral('NotBar')
      ),
    ]),
    callExpression(identifier('require'), [
      indexExpression(
        memberExpression(identifier('Packages'), '.', identifier('Foo')),
        stringLiteral('NotBar')
      ),
    ]),
  ])('should return false for non matching simple import', (given) => {
    const rename = renameNestedImport(['Foo', 'Bar'], 'Fizz');

    // narrowing TS type
    assert(isRequire(given));

    expect(rename.test(given)).toBe(false);
  });
});

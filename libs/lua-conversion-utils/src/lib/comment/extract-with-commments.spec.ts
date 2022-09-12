import { typeAnnotation, typeAny } from '@js-to-lua/lua-types';
import { testUtils } from '@js-to-lua/handler-utils';
import { extractWithComments } from './extract-with-comments';

describe('extractWithComments', () => {
  const { withLuaComments } = testUtils;
  it('should extract node without comments', () => {
    const given = typeAnnotation(typeAny());
    const expected = typeAny();

    const actual = extractWithComments(given, (base) => base.typeAnnotation);

    expect(actual).toEqual(expected);
  });

  it('should extract node and keep comments', () => {
    const given = withLuaComments(typeAnnotation(typeAny()));
    const expected = withLuaComments(typeAny());

    const actual = extractWithComments(given, (base) => base.typeAnnotation);

    expect(actual).toEqual(expected);
  });

  it('should extract node and keep comments - not override', () => {
    const given = withLuaComments(
      typeAnnotation(withLuaComments(typeAny(), 'TYPE')),
      'ANNOTATION'
    );
    const expected = withLuaComments(
      withLuaComments(typeAny(), 'TYPE'),
      'ANNOTATION'
    );

    const actual = extractWithComments(given, (base) => base.typeAnnotation);

    expect(actual).toEqual(expected);
  });
});

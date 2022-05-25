import { identifier as babelIdentifier, tsQualifiedName } from '@babel/types';
import { createWithQualifiedNameAdditionalImportExtra } from '@js-to-lua/lua-conversion-utils';
import { identifier } from '@js-to-lua/lua-types';
import { createTsQualifiedNameHandler } from './ts-qualified-name.handler';

describe('TSQualifiedName handler', () => {
  const tsQualifiedNameHandler = createTsQualifiedNameHandler();
  const source = '';

  it('should handle with only identifiers ', () => {
    const given = tsQualifiedName(
      babelIdentifier('Foo'),
      babelIdentifier('Bar')
    );

    const expected = createWithQualifiedNameAdditionalImportExtra(
      'Foo_Bar',
      'Foo'
    )(identifier('Foo_Bar'));

    expect(tsQualifiedNameHandler.handler(source, {}, given)).toEqual(expected);
  });

  it('should handle multiple TsQualifiedName levels', () => {
    const given = tsQualifiedName(
      tsQualifiedName(
        tsQualifiedName(babelIdentifier('Foo'), babelIdentifier('Bar')),
        babelIdentifier('Baz')
      ),
      babelIdentifier('Fuzz')
    );

    const expected = createWithQualifiedNameAdditionalImportExtra(
      'Foo_Bar_Baz_Fuzz',
      'Foo'
    )(identifier('Foo_Bar_Baz_Fuzz'));

    expect(tsQualifiedNameHandler.handler(source, {}, given)).toEqual(expected);
  });
});

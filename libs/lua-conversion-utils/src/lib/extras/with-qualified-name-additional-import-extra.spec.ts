import { nodeGroup } from '@js-to-lua/lua-types';
import * as assert from 'assert';
import {
  createWithQualifiedNameAdditionalImportExtra,
  getAllQualifiedNameAdditionalImportExtra,
  getQualifiedNameAdditionalImportExtra,
  isWithQualifiedNameAdditionalImportExtra,
} from './with-qualified-name-additional-import-extra';

describe('With qualified name additional import extra', () => {
  const withQualifiedNameAdditionalImportExtra1 =
    createWithQualifiedNameAdditionalImportExtra('Foo_Bar', 'Foo');
  const withQualifiedNameAdditionalImportExtra2 =
    createWithQualifiedNameAdditionalImportExtra('Foo_Baz', 'Foo');

  it('should return true when with qualified name additional import extra', () => {
    const given = withQualifiedNameAdditionalImportExtra1(nodeGroup([]));
    expect(isWithQualifiedNameAdditionalImportExtra(given)).toBe(true);
  });

  it('should return false when not with qualified name additional import extra', () => {
    const given = nodeGroup([]);
    expect(isWithQualifiedNameAdditionalImportExtra(given)).toBe(false);
  });

  it('should extract qualified name additional import', () => {
    const given = withQualifiedNameAdditionalImportExtra1(nodeGroup([]));
    assert(isWithQualifiedNameAdditionalImportExtra(given));
    expect(getQualifiedNameAdditionalImportExtra('Foo_Bar', given)).toEqual({
      baseIdentifier: 'Foo',
    });
  });

  it('should extract all qualified name additional import', () => {
    const given = withQualifiedNameAdditionalImportExtra2(
      withQualifiedNameAdditionalImportExtra1(nodeGroup([]))
    );
    assert(isWithQualifiedNameAdditionalImportExtra(given));
    expect(getAllQualifiedNameAdditionalImportExtra(given)).toEqual({
      Foo_Bar: { baseIdentifier: 'Foo' },
      Foo_Baz: { baseIdentifier: 'Foo' },
    });
  });
});

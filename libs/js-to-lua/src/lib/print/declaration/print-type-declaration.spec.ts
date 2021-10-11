import { createPrintTypeAliasDeclaration } from './print-type-declaration';
import {
  identifier,
  typeAliasDeclaration,
  typeAny,
  typeReference,
} from '@js-to-lua/lua-types';

describe('Print type alias declaration', () => {
  const printTypeAliasDeclaration = createPrintTypeAliasDeclaration((node) => {
    switch (node.type) {
      case 'Identifier':
        return node.name;
      case 'LuaTypeAny':
        return 'any';
      case 'TypeReference':
        return `Reference${node.typeName.name}`;
      default:
        return `<-${node.type}->`;
    }
  });

  it('should print simple type declaration', () => {
    const given = typeAliasDeclaration(identifier('Foo'), typeAny());

    expect(printTypeAliasDeclaration(given)).toEqual(`type Foo = any`);
  });

  it('should print generic type declaration', () => {
    const given = typeAliasDeclaration(identifier('Foo'), typeAny(), [
      typeReference(identifier('T')),
    ]);

    expect(printTypeAliasDeclaration(given)).toEqual(
      `type Foo<ReferenceT> = any`
    );
  });

  it('should print generic type declaration with multiple generic params', () => {
    const given = typeAliasDeclaration(identifier('Foo'), typeAny(), [
      typeReference(identifier('T')),
      typeReference(identifier('V')),
    ]);

    expect(printTypeAliasDeclaration(given)).toEqual(
      `type Foo<ReferenceT, ReferenceV> = any`
    );
  });
});

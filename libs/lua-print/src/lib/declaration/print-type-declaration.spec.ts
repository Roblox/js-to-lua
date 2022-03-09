import {
  identifier,
  typeAliasDeclaration,
  typeAny,
  typeParameterDeclaration,
  typeReference,
} from '@js-to-lua/lua-types';
import { createPrintTypeAliasDeclaration } from './print-type-declaration';

describe('Print type alias declaration', () => {
  const printTypeAliasDeclaration = createPrintTypeAliasDeclaration((node) => {
    switch (node.type) {
      case 'Identifier':
        return node.name;
      case 'LuaTypeAny':
        return 'any';
      case 'TypeReference':
        return `Reference${node.typeName.name}`;
      case 'LuaTypeParameterDeclaration':
        return `<LuaTypeParameterDeclaration>`;
      default:
        return `<-${node.type}->`;
    }
  });

  it('should print simple type declaration', () => {
    const given = typeAliasDeclaration(identifier('Foo'), typeAny());

    expect(printTypeAliasDeclaration(given)).toEqual(`type Foo = any`);
  });

  it('should print TypeParameterDeclaration', () => {
    const given = typeAliasDeclaration(
      identifier('Foo'),
      typeAny(),
      typeParameterDeclaration([typeReference(identifier('T'))])
    );

    expect(printTypeAliasDeclaration(given)).toEqual(
      `type Foo<LuaTypeParameterDeclaration> = any`
    );
  });
});

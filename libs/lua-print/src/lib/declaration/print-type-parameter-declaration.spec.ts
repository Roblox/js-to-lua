import {
  identifier,
  typeParameterDeclaration,
  typeReference,
} from '@js-to-lua/lua-types';
import { createPrintTypeParameterDeclaration } from './print-type-parameter-declaration';

describe('Print type alias declaration', () => {
  const printTypeParameterDeclaration = createPrintTypeParameterDeclaration(
    (node) => {
      switch (node.type) {
        case 'TypeReference':
          return `Reference${node.typeName.name}`;
        default:
          return `<-${node.type}->`;
      }
    }
  );

  it('should print single generic params', () => {
    const given = typeParameterDeclaration([typeReference(identifier('T'))]);

    expect(printTypeParameterDeclaration(given)).toEqual(`<ReferenceT>`);
  });

  it('should print multiple params', () => {
    const given = typeParameterDeclaration([
      typeReference(identifier('T')),
      typeReference(identifier('V')),
    ]);

    expect(printTypeParameterDeclaration(given)).toEqual(
      `<ReferenceT,ReferenceV>`
    );
  });
});

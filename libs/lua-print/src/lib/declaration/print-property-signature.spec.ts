import {
  identifier,
  LuaNode,
  stringLiteral,
  typeAnnotation,
  typeAny,
  typeNumber,
  typePropertySignature,
  typeString,
} from '@js-to-lua/lua-types';
import { createPrintPropertySignature } from './print-property-signature';

describe('Print property signature', () => {
  const printNode = (node: LuaNode): string => {
    switch (node.type) {
      case 'Identifier':
        return node.name;
      case 'LuaTypeAny':
        return 'any';
      case 'TypeReference':
        return `Reference${node.typeName.name}`;
      case 'LuaTypeAnnotation':
        return node.typeAnnotation ? `: ${printNode(node.typeAnnotation)}` : '';
      case 'LuaTypeString':
        return 'string';
      case 'LuaTypeNumber':
        return 'number';
      case 'StringLiteral':
        return `"${node.value}"`;
      default:
        return `<-${node.type}->`;
    }
  };

  const printPropertySignature = createPrintPropertySignature(printNode);

  it('should print property signature with identifier', () => {
    const given = typePropertySignature(
      identifier('foo'),
      typeAnnotation(typeAny())
    );

    expect(printPropertySignature(given)).toEqual(`foo: any`);
  });

  it('should print property signature with string literal', () => {
    const given = typePropertySignature(
      stringLiteral('a/b/c'),
      typeAnnotation(typeAny())
    );

    expect(printPropertySignature(given)).toEqual(`["a/b/c"]: any`);
  });

  it('should print property signature with string type', () => {
    const given = typePropertySignature(
      typeString(),
      typeAnnotation(typeAny())
    );

    expect(printPropertySignature(given)).toEqual(`[string]: any`);
  });

  it('should print property signature with number type', () => {
    const given = typePropertySignature(
      typeNumber(),
      typeAnnotation(typeAny())
    );

    expect(printPropertySignature(given)).toEqual(`[number]: any`);
  });
});

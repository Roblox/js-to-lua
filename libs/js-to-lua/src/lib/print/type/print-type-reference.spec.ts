import { createPrintTypeReference } from './print-type-reference';
import {
  identifier,
  LuaNode,
  LuaTypeReference,
  typeAny,
  typeReference,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';

describe('Print type reference', () => {
  const printTypeReference = createPrintTypeReference(
    jest.fn().mockImplementation((node: LuaNode) => {
      switch (node.type) {
        case 'Identifier':
          return node.name;
        case 'LuaTypeAny':
          return 'any';
        case 'TypeReference':
          return applyTo(node, (innerNode: LuaTypeReference) =>
            printTypeReference(innerNode)
          );
        default:
          return '--unhandled--';
      }
    })
  );

  it('should print type reference without generic type params', () => {
    const given = typeReference(identifier('TypeReference'));

    const expected = 'TypeReference';

    expect(printTypeReference(given)).toEqual(expected);
  });

  it('should print type reference with generic type params', () => {
    const given = typeReference(identifier('TypeReference'), [typeAny()]);

    const expected = 'TypeReference<any>';

    expect(printTypeReference(given)).toEqual(expected);
  });

  it('should print type reference with nested generic type params', () => {
    const given = typeReference(identifier('TypeReference'), [
      typeAny(),
      typeReference(identifier('NestedTypeReference'), [typeAny()]),
    ]);

    const expected = 'TypeReference<any, NestedTypeReference<any>>';

    expect(printTypeReference(given)).toEqual(expected);
  });
});

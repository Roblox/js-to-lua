import {
  isTypeUnion,
  LuaNode,
  typeAny,
  typeIntersection,
  typeNil,
  typeNumber,
  typeString,
  typeUnion,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { createPrintTypeUnion } from './print-type-union';

describe('Print type union', () => {
  const printTypeUnion = createPrintTypeUnion(
    jest.fn().mockImplementation((node: LuaNode) => {
      if (isTypeUnion(node)) {
        return printTypeUnion(node);
      }
      return node.type;
    })
  );

  it('should print type union with one union type', () => {
    const given = typeUnion([typeNumber()]);

    const expected = 'LuaTypeNumber';

    expect(printTypeUnion(given)).toEqual(expected);
  });

  it('should print type union with two union type', () => {
    const given = typeUnion([typeNumber(), typeString()]);

    const expected = dedent`
      LuaTypeNumber
      | LuaTypeString`;

    expect(printTypeUnion(given)).toEqual(expected);
  });

  it('should print type union with multiple union type', () => {
    const given = typeUnion([typeNumber(), typeString(), typeAny()]);

    const expected = dedent`
      LuaTypeNumber
      | LuaTypeString
      | LuaTypeAny`;

    expect(printTypeUnion(given)).toEqual(expected);
  });

  it('should print type union with nested union type', () => {
    const given = typeUnion([
      typeNumber(),
      typeString(),
      typeUnion([typeAny(), typeNil()]),
    ]);

    const expected = dedent`
      LuaTypeNumber
      | LuaTypeString
      | LuaTypeAny
      | LuaTypeNil`;

    expect(printTypeUnion(given)).toEqual(expected);
  });

  it('should print type union with nested intersection type', () => {
    const given = typeUnion([
      typeNumber(),
      typeString(),
      typeIntersection([typeAny(), typeNil()]),
    ]);

    const expected = dedent`
      LuaTypeNumber
      | LuaTypeString
      | (LuaTypeIntersection)`;

    expect(printTypeUnion(given)).toEqual(expected);
  });
});

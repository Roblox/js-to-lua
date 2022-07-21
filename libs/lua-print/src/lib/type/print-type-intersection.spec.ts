import {
  isTypeIntersection,
  LuaNode,
  typeAny,
  typeIntersection,
  typeNil,
  typeNumber,
  typeString,
  typeUnion,
} from '@js-to-lua/lua-types';
import { createPrintTypeIntersection } from './print-type-intersection';

describe('Print type intersection', () => {
  const printTypeIntersection = createPrintTypeIntersection(
    jest.fn().mockImplementation((node: LuaNode) => {
      if (isTypeIntersection(node)) {
        return printTypeIntersection(node);
      }
      return node.type;
    })
  );

  it('should print type intersection with one type', () => {
    const given = typeIntersection([typeNumber()]);

    const expected = 'LuaTypeNumber';

    expect(printTypeIntersection(given)).toEqual(expected);
  });

  it('should print type intersection with two types', () => {
    const given = typeIntersection([typeNumber(), typeString()]);

    const expected = 'LuaTypeNumber & LuaTypeString';

    expect(printTypeIntersection(given)).toEqual(expected);
  });

  it('should print type intersection with multiple types', () => {
    const given = typeIntersection([typeNumber(), typeString(), typeAny()]);

    const expected = 'LuaTypeNumber & LuaTypeString & LuaTypeAny';

    expect(printTypeIntersection(given)).toEqual(expected);
  });

  it('should print type intersection with nested intersection type', () => {
    const given = typeIntersection([
      typeNumber(),
      typeString(),
      typeIntersection([typeAny(), typeNil()]),
    ]);

    const expected = 'LuaTypeNumber & LuaTypeString & LuaTypeAny & LuaTypeNil';

    expect(printTypeIntersection(given)).toEqual(expected);
  });

  it('should print type intersection with nested union type', () => {
    const given = typeIntersection([
      typeNumber(),
      typeString(),
      typeUnion([typeAny(), typeNumber()]),
    ]);

    const expected = 'LuaTypeNumber & LuaTypeString & (LuaTypeUnion)';

    expect(printTypeIntersection(given)).toEqual(expected);
  });
});

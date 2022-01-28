import {
  isTypeIntersection,
  LuaNode,
  typeAny,
  typeIntersection,
  typeNumber,
  typeString,
  typeUnion,
  typeVoid,
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
    const given = typeIntersection([
      typeNumber(),
      typeString(),
      typeAny(),
      typeVoid(),
    ]);

    const expected = 'LuaTypeNumber & LuaTypeString & LuaTypeAny & LuaTypeVoid';

    expect(printTypeIntersection(given)).toEqual(expected);
  });

  it('should print type intersection with nested intersection type', () => {
    const given = typeIntersection([
      typeNumber(),
      typeString(),
      typeIntersection([typeAny(), typeVoid()]),
    ]);

    const expected = 'LuaTypeNumber & LuaTypeString & LuaTypeAny & LuaTypeVoid';

    expect(printTypeIntersection(given)).toEqual(expected);
  });

  it('should print type intersection with nested union type', () => {
    const given = typeIntersection([
      typeNumber(),
      typeString(),
      typeUnion([typeAny(), typeVoid()]),
    ]);

    const expected = 'LuaTypeNumber & LuaTypeString & (LuaTypeUnion)';

    expect(printTypeIntersection(given)).toEqual(expected);
  });
});

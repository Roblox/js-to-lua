import {
  isTypeIntersection,
  LuaNode,
  typeAny,
  typeIntersection,
  typeNumber,
  typeString,
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

  it('should print type union with one union type', () => {
    const given = typeIntersection([typeNumber()]);

    const expected = 'LuaTypeNumber';

    expect(printTypeIntersection(given)).toEqual(expected);
  });

  it('should print type union with two union type', () => {
    const given = typeIntersection([typeNumber(), typeString()]);

    const expected = 'LuaTypeNumber & LuaTypeString';

    expect(printTypeIntersection(given)).toEqual(expected);
  });

  it('should print type union with multiple union type', () => {
    const given = typeIntersection([
      typeNumber(),
      typeString(),
      typeAny(),
      typeVoid(),
    ]);

    const expected = 'LuaTypeNumber & LuaTypeString & LuaTypeAny & LuaTypeVoid';

    expect(printTypeIntersection(given)).toEqual(expected);
  });

  it('should print type union with nested union type', () => {
    const given = typeIntersection([
      typeNumber(),
      typeString(),
      typeIntersection([typeAny(), typeVoid()]),
    ]);

    const expected = 'LuaTypeNumber & LuaTypeString & LuaTypeAny & LuaTypeVoid';

    expect(printTypeIntersection(given)).toEqual(expected);
  });
});

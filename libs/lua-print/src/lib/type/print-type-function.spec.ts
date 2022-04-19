import {
  functionTypeParam,
  identifier,
  typeAny,
  typeBoolean,
  typeFunction,
  typeNumber,
  typeParameterDeclaration,
  typeReference,
  typeString,
  typeVariadicFunction,
} from '@js-to-lua/lua-types';
import { printNode } from '../print-node';
import { createPrintTypeFunction } from './print-type-function';

describe('Print type function', () => {
  const printTypeFunction = createPrintTypeFunction(printNode);

  describe('non generic', () => {
    it('should print function without params', () => {
      const given = typeFunction([], typeAny());
      const expected = `() -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without one param', () => {
      const given = typeFunction(
        [functionTypeParam(identifier('arg'), typeString())],
        typeAny()
      );
      const expected = `(arg:string) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without multiple params', () => {
      const given = typeFunction(
        [
          functionTypeParam(identifier('foo'), typeString()),
          functionTypeParam(identifier('bar'), typeNumber()),
          functionTypeParam(identifier('baz'), typeBoolean()),
        ],
        typeAny()
      );
      const expected = `(foo:string, bar:number, baz:boolean) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without one param and rest args', () => {
      const given = typeVariadicFunction(
        [functionTypeParam(identifier('arg'), typeString())],
        typeReference(identifier('Rest')),

        typeAny()
      );
      const expected = `(arg:string, ...Rest) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without multiple params and rest args', () => {
      const given = typeVariadicFunction(
        [
          functionTypeParam(identifier('foo'), typeString()),
          functionTypeParam(identifier('bar'), typeNumber()),
          functionTypeParam(identifier('baz'), typeBoolean()),
        ],
        typeReference(identifier('Rest')),
        typeAny()
      );
      const expected = `(foo:string, bar:number, baz:boolean, ...Rest) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });
  });

  describe('generic', () => {
    it('should print function without params', () => {
      const given = typeFunction(
        [],
        typeAny(),
        typeParameterDeclaration([
          typeReference(identifier('T')),
          typeReference(identifier('V')),
        ])
      );
      const expected = `<T,V>() -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without one param', () => {
      const given = typeFunction(
        [functionTypeParam(identifier('arg'), typeString())],
        typeAny(),
        typeParameterDeclaration([
          typeReference(identifier('T')),
          typeReference(identifier('V')),
        ])
      );
      const expected = `<T,V>(arg:string) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without multiple params', () => {
      const given = typeFunction(
        [
          functionTypeParam(identifier('foo'), typeString()),
          functionTypeParam(identifier('bar'), typeNumber()),
          functionTypeParam(identifier('baz'), typeBoolean()),
        ],
        typeAny(),
        typeParameterDeclaration([
          typeReference(identifier('T')),
          typeReference(identifier('V')),
        ])
      );
      const expected = `<T,V>(foo:string, bar:number, baz:boolean) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without one param and rest args', () => {
      const given = typeVariadicFunction(
        [functionTypeParam(identifier('arg'), typeString())],
        typeReference(identifier('Rest')),
        typeAny(),
        typeParameterDeclaration([
          typeReference(identifier('T')),
          typeReference(identifier('V')),
        ])
      );
      const expected = `<T,V>(arg:string, ...Rest) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without multiple params and rest args', () => {
      const given = typeVariadicFunction(
        [
          functionTypeParam(identifier('foo'), typeString()),
          functionTypeParam(identifier('bar'), typeNumber()),
          functionTypeParam(identifier('baz'), typeBoolean()),
        ],
        typeReference(identifier('Rest')),
        typeAny(),
        typeParameterDeclaration([
          typeReference(identifier('T')),
          typeReference(identifier('V')),
        ])
      );
      const expected = `<T,V>(foo:string, bar:number, baz:boolean, ...Rest) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });
  });
});

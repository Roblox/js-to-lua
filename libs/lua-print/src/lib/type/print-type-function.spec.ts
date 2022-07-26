import {
  functionReturnType,
  functionTypeParamEllipse,
  functionParamName,
  identifier,
  typeAny,
  typeBoolean,
  typeFunction,
  typeNumber,
  typeParameterDeclaration,
  typeReference,
  typeString,
} from '@js-to-lua/lua-types';
import { printNode } from '../print-node';
import { createPrintTypeFunction } from './print-type-function';

describe('Print type function', () => {
  const printTypeFunction = createPrintTypeFunction(printNode);

  describe('non generic', () => {
    it('should print function without params', () => {
      const given = typeFunction([], functionReturnType([typeAny()]));
      const expected = `() -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without one param', () => {
      const given = typeFunction(
        [functionParamName(identifier('arg'), typeString())],
        functionReturnType([typeAny()])
      );
      const expected = `(arg:string) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without multiple params', () => {
      const given = typeFunction(
        [
          functionParamName(identifier('foo'), typeString()),
          functionParamName(identifier('bar'), typeNumber()),
          functionParamName(identifier('baz'), typeBoolean()),
        ],
        functionReturnType([typeAny()])
      );
      const expected = `(foo:string, bar:number, baz:boolean) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without one param and rest args', () => {
      const given = typeFunction(
        [
          functionParamName(identifier('arg'), typeString()),
          functionTypeParamEllipse(typeReference(identifier('Rest'))),
        ],
        functionReturnType([typeAny()])
      );
      const expected = `(arg:string, ...Rest) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without multiple params and rest args', () => {
      const given = typeFunction(
        [
          functionParamName(identifier('foo'), typeString()),
          functionParamName(identifier('bar'), typeNumber()),
          functionParamName(identifier('baz'), typeBoolean()),
          functionTypeParamEllipse(typeReference(identifier('Rest'))),
        ],
        functionReturnType([typeAny()])
      );
      const expected = `(foo:string, bar:number, baz:boolean, ...Rest) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });
  });

  describe('generic', () => {
    it('should print function without params', () => {
      const given = typeFunction(
        [],
        functionReturnType([typeAny()]),
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
        [functionParamName(identifier('arg'), typeString())],
        functionReturnType([typeAny()]),
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
          functionParamName(identifier('foo'), typeString()),
          functionParamName(identifier('bar'), typeNumber()),
          functionParamName(identifier('baz'), typeBoolean()),
        ],
        functionReturnType([typeAny()]),
        typeParameterDeclaration([
          typeReference(identifier('T')),
          typeReference(identifier('V')),
        ])
      );
      const expected = `<T,V>(foo:string, bar:number, baz:boolean) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without one param and rest args', () => {
      const given = typeFunction(
        [
          functionParamName(identifier('arg'), typeString()),
          functionTypeParamEllipse(typeReference(identifier('Rest'))),
        ],
        functionReturnType([typeAny()]),
        typeParameterDeclaration([
          typeReference(identifier('T')),
          typeReference(identifier('V')),
        ])
      );
      const expected = `<T,V>(arg:string, ...Rest) -> any`;
      expect(printTypeFunction(given)).toBe(expected);
    });

    it('should print function without multiple params and rest args', () => {
      const given = typeFunction(
        [
          functionParamName(identifier('foo'), typeString()),
          functionParamName(identifier('bar'), typeNumber()),
          functionParamName(identifier('baz'), typeBoolean()),
          functionTypeParamEllipse(typeReference(identifier('Rest'))),
        ],
        functionReturnType([typeAny()]),
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

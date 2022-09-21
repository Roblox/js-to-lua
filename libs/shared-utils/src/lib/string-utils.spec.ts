import { capitalize, decapitalize } from './string-utils';

describe('String utils', () => {
  describe('capitalize', () => {
    it('should capitalize strings', () => {
      expect(capitalize('abc')).toBe('Abc');
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('æg')).toBe('Æg');
      expect(capitalize('żuk')).toBe('Żuk');
    });

    it('should not change already capitalized strings', () => {
      expect(capitalize('Abc')).toBe('Abc');
      expect(capitalize('Hello')).toBe('Hello');
      expect(capitalize('Æg')).toBe('Æg');
      expect(capitalize('Żuk')).toBe('Żuk');
    });
  });
  describe('decapitalize', () => {
    it('should de-capitalize strings', () => {
      expect(decapitalize('Abc')).toBe('abc');
      expect(decapitalize('Hello')).toBe('hello');
      expect(decapitalize('Æg')).toBe('æg');
      expect(decapitalize('Żuk')).toBe('żuk');
    });

    it('should not change already not capitalized strings', () => {
      expect(decapitalize('abc')).toBe('abc');
      expect(decapitalize('hello')).toBe('hello');
      expect(decapitalize('æg')).toBe('æg');
      expect(decapitalize('żuk')).toBe('żuk');
    });
  });
});

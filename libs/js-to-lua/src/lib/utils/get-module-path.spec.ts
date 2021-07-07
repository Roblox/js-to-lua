import { getModulePath } from './get-module-path';

describe('Get module path', () => {
  describe('in init file', () => {
    const sut = getModulePath({ isInitFile: true });

    it('should return simple relative path', () => {
      const given = './foo/bar';
      const expected = {
        isRelative: true,
        path: ['script', 'foo', 'bar'],
      };

      expect(sut(given)).toEqual(expected);
    });

    it('should return simple relative path with parent directory', () => {
      const given = '../foo/bar';
      const expected = {
        isRelative: true,
        path: ['script', 'Parent', 'foo', 'bar'],
      };

      expect(sut(given)).toEqual(expected);
    });

    it('should return relative path with multiple parent directories', () => {
      const given = '../../foo/bar';
      const expected = {
        isRelative: true,
        path: ['script', 'Parent', 'Parent', 'foo', 'bar'],
      };

      expect(sut(given)).toEqual(expected);
    });

    it('should return complex relative path', () => {
      const given = '../../foo/./../bar';
      const expected = {
        isRelative: true,
        path: ['script', 'Parent', 'Parent', 'foo', 'Parent', 'bar'],
      };

      expect(sut(given)).toEqual(expected);
    });

    it('should return simple absolute path', () => {
      const given = 'foo';
      const expected = {
        isRelative: false,
        path: ['Packages', 'foo'],
      };

      expect(sut(given)).toEqual(expected);
    });

    it('should return nested absolute path', () => {
      const given = 'foo/bar';
      const expected = {
        isRelative: false,
        path: ['Packages', 'foo', 'bar'],
      };

      expect(sut(given)).toEqual(expected);
    });
  });

  describe('in non init file', () => {
    const sut = getModulePath({ isInitFile: false });

    it('should return simple relative path', () => {
      const given = './foo/bar';
      const expected = {
        isRelative: true,
        path: ['script', 'Parent', 'foo', 'bar'],
      };

      expect(sut(given)).toEqual(expected);
    });

    it('should return simple relative path with parent directory', () => {
      const given = '../foo/bar';
      const expected = {
        isRelative: true,
        path: ['script', 'Parent', 'Parent', 'foo', 'bar'],
      };

      expect(sut(given)).toEqual(expected);
    });

    it('should return relative path with multiple parent directories', () => {
      const given = '../../foo/bar';
      const expected = {
        isRelative: true,
        path: ['script', 'Parent', 'Parent', 'Parent', 'foo', 'bar'],
      };

      expect(sut(given)).toEqual(expected);
    });

    it('should return complex relative path', () => {
      const given = '../../foo/./../bar';
      const expected = {
        isRelative: true,
        path: ['script', 'Parent', 'Parent', 'Parent', 'foo', 'Parent', 'bar'],
      };

      expect(sut(given)).toEqual(expected);
    });

    it('should return simple absolute path', () => {
      const given = 'foo';
      const expected = {
        isRelative: false,
        path: ['Packages', 'foo'],
      };

      expect(sut(given)).toEqual(expected);
    });

    it('should return nested absolute path', () => {
      const given = 'foo/bar';
      const expected = {
        isRelative: false,
        path: ['Packages', 'foo', 'bar'],
      };

      expect(sut(given)).toEqual(expected);
    });
  });
});

import {
  createUpstreamPath,
  extractUrl,
  getRev,
  inferRootDir,
} from './upstream-utils';
import * as fsModule from 'fs/promises';
import * as pathModule from 'path';
import * as gitUtilsModule from './git-utils';
import { identity } from 'ramda';

const getTag: jest.Mock = jest.fn();
const getSha: jest.Mock = jest.fn();
const getRemoteUrl: jest.Mock = jest.fn();
const getTopLevelPath: jest.Mock = jest.fn();
const commitFiles: jest.Mock = jest.fn();
const applyPatch: jest.Mock = jest.fn();
const realpath: jest.Mock = jest.fn(identity);
const relative: jest.Mock = jest.fn();

jest.mock('./git-utils', (): typeof gitUtilsModule => {
  return {
    getTag: (...args) => getTag(...args),
    getSha: (...args) => getSha(...args),
    getRemoteUrl: (...args) => getRemoteUrl(...args),
    getTopLevelPath: (...args) => getTopLevelPath(...args),
    commitFiles: (...args) => commitFiles(...args),
    applyPatch: (...args) => applyPatch(...args),
  };
});

jest.mock(
  'fs/promises',
  (): Partial<typeof fsModule> => ({
    realpath: (...args) => realpath(...args),
  })
);

jest.mock(
  'path',
  (): Partial<typeof pathModule> => ({
    relative: (...args) => relative(...args),
    join: (...args) => args.join('/'),
  })
);

const rootDir = 'path/to/repo';

describe('Upstream utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractUrl', () => {
    it('extractUrl works with SSH with .git suffix', () => {
      const given = extractUrl('git@github.com:Roblox/js-to-lua.git');
      const expected = 'https://github.com/Roblox/js-to-lua';

      expect(given).toEqual(expected);
    });

    it('extractUrl works with SSH without .git suffix', () => {
      const given = extractUrl('git@github.com:Roblox/js-to-lua');
      const expected = 'https://github.com/Roblox/js-to-lua';

      expect(given).toEqual(expected);
    });

    it('extractUrl works with HTTPS with .git suffix', () => {
      const given = extractUrl('https://github.com/Roblox/js-to-lua.git');
      const expected = 'https://github.com/Roblox/js-to-lua';

      expect(given).toEqual(expected);
    });

    it('extractUrl works with HTTPS without .git suffix', () => {
      const given = extractUrl('https://github.com/Roblox/js-to-lua');
      const expected = 'https://github.com/Roblox/js-to-lua';

      expect(given).toEqual(expected);
    });

    it('extractUrl should return undefined if the remoteUrl provided does not match any known format', () => {
      const given = extractUrl('https://roblox.com');
      const expected = undefined;

      expect(given).toEqual(expected);
    });
  });

  describe('getSha', () => {
    it('getSha returns a tag when a tag is available', async () => {
      getTag.mockImplementationOnce(() => Promise.resolve('v1.0.0'));
      await expect(getRev(rootDir)).resolves.toBe('v1.0.0');
    });

    it('getSha returns a sha when tag is empty', async () => {
      getTag.mockImplementationOnce(() => Promise.resolve(''));
      getSha.mockImplementationOnce(() => Promise.resolve('sha'));

      await expect(getRev(rootDir)).resolves.toBe('sha');
    });
  });

  describe('createUpstreamPath', () => {
    it('createUpstreamPath when rootDir is passed', async () => {
      getRemoteUrl.mockImplementationOnce(() =>
        Promise.resolve('https://github.com/Roblox/js-to-lua.git')
      );
      relative.mockImplementationOnce(
        (_from: string, to: string) => `relative/${to}`
      );

      const given = createUpstreamPath('path/to/a/file.js', {
        rootDir: 'path/to',
        sha: 'sha2',
      });
      await expect(given).resolves.toBe(
        'https://github.com/Roblox/js-to-lua/blob/sha2/relative/path/to/a/file.js'
      );
    });

    it('createUpstreamPath when rootDir is NOT passed', async () => {
      getRemoteUrl.mockImplementationOnce(() =>
        Promise.resolve('https://github.com/Roblox/js-to-lua.git')
      );

      relative.mockImplementationOnce(
        (_from: string, to: string) => `relative/${to}`
      );

      const given = createUpstreamPath('path/to/a/file.js', {
        rootDir: '',
        sha: 'sha2',
      });

      await expect(given).resolves.toBe(
        'https://github.com/Roblox/js-to-lua/blob/sha2/relative/path/to/a/file.js'
      );
    });

    it('createUpstreamPath when sha is NOT passed', async () => {
      getRemoteUrl.mockImplementationOnce(() =>
        Promise.resolve('https://github.com/Roblox/js-to-lua.git')
      );
      getSha.mockImplementationOnce(() => Promise.resolve('default-sha'));
      relative.mockImplementationOnce(
        (_from: string, to: string) => `relative/${to}`
      );

      const given = createUpstreamPath('path/to/a/file.js', {
        rootDir: 'rootDir',
      });

      await expect(given).resolves.toBe(
        'https://github.com/Roblox/js-to-lua/blob/default-sha/relative/path/to/a/file.js'
      );
    });

    it('createUpstreamPath when an invalid url is provided', async () => {
      getRemoteUrl.mockImplementationOnce(() =>
        Promise.resolve('https://notgithub.com/Roblox/js-to-lua.git')
      );
      getSha.mockImplementationOnce(() => Promise.resolve('default-sha'));
      relative.mockImplementationOnce(
        (_from: string, to: string) => `relative/${to}`
      );

      const given = createUpstreamPath('path/to/a/file.js', {
        rootDir: 'rootDir',
      });

      await expect(given).resolves.toBeUndefined();
    });

    it('createUpstreamPath when get remote url returns undefined', async () => {
      getRemoteUrl.mockImplementationOnce(() => Promise.resolve(undefined));

      const given = createUpstreamPath('path/to/a/file.js', {
        rootDir: 'rootDir',
      });

      await expect(given).resolves.toBeUndefined();
    });

    it('constructs upstream path with remoteUrl passed', async () => {
      relative.mockImplementationOnce(
        (_from: string, to: string) => `relative/${to}`
      );

      const given = createUpstreamPath('path/to/a/file.js', {
        remoteUrl: 'https://github.com/testUser/testRepo',
        rootDir: 'path/to',
        sha: 'sha',
      });

      await expect(given).resolves.toBe(
        'https://github.com/testUser/testRepo/blob/sha/relative/path/to/a/file.js'
      );
    });

    it('return undefined when INVALID remoteUrl passed', async () => {
      relative.mockImplementationOnce(
        (_from: string, to: string) => `relative/${to}`
      );

      const given = createUpstreamPath('path/to/a/file.js', {
        remoteUrl: 'https://notgithub.com/testUser/testRepo',
        rootDir: 'path/to',
        sha: 'sha',
      });

      await expect(given).resolves.toBeUndefined();
    });
  });

  describe('inferRootDir', () => {
    it('inferRootDir when top level path can be found', () => {
      getTopLevelPath.mockImplementationOnce(() =>
        Promise.resolve('/top/level/')
      );

      expect(inferRootDir('path/to/file.js')).resolves.toBe('/top/level/');
    });

    it('inferRootDir when top level path can NOT be found', () => {
      getTopLevelPath.mockImplementationOnce(() => Promise.resolve(undefined));

      expect(inferRootDir('path/to/file.js')).resolves.toBe('./');
    });
  });
});

import type { promisify as promisifyType } from 'util';
import type { SimpleGit } from 'simple-git';
import * as gitUtilsModule from './git-utils';
import { getSha, getTag, getTopLevelPath } from './git-utils';
import { exec } from 'child_process';

const execAsync = jest.fn();

const promisify = jest.fn().mockImplementation((...args) => {
  const [fn] = args;
  if (fn === exec) {
    return execAsync;
  }

  throw 'should not reach this';
});

jest.mock('util', () => {
  return {
    promisify: (...args: Parameters<typeof promisifyType>) =>
      promisify(...args),
  };
});

jest.mock('simple-git', () => {
  return {
    simpleGit: () =>
      ({
        getConfig,
        revparse,
      } as unknown as SimpleGit),
  };
});

const getConfig: jest.Mock = jest.fn(),
  revparse: jest.Mock = jest.fn();

const rootDir = 'path/to/repo';

describe('Upstream utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getRemoteUrl returns the origin of a git repository', async () => {
    getConfig.mockImplementationOnce(async () => {
      return new Promise((resolve) => {
        resolve({ value: 'git@github.com:Roblox/js-to-lua' });
      });
    });

    await expect(gitUtilsModule.getRemoteUrl(rootDir)).resolves.toEqual(
      'git@github.com:Roblox/js-to-lua'
    );
  });

  it('getTag if it exists', async () => {
    execAsync.mockImplementationOnce(() =>
      Promise.resolve({ stdout: 'v1.0.0' })
    );

    await expect(getTag(rootDir)).resolves.toBe('v1.0.0');
  });

  it('getTag should be undefined if exec throws', async () => {
    execAsync.mockImplementationOnce(() => Promise.reject());

    await expect(getTag(rootDir)).resolves.toBeUndefined();
  });

  it('getTag should return undefined if tag is empty ', async () => {
    execAsync.mockImplementationOnce(() => Promise.resolve({ stdout: '' }));

    await expect(getTag(rootDir)).resolves.toBeUndefined();
  });

  it('getTag should return undefined if tag is white spaces only ', async () => {
    execAsync.mockImplementationOnce(() =>
      Promise.resolve({ stdout: '     ' })
    );

    await expect(getTag(rootDir)).resolves.toBeUndefined();
  });

  it('getSha', async () => {
    revparse.mockImplementationOnce(() => 'sha');

    await expect(getSha(rootDir)).resolves.toBe('sha');
  });

  it('getTopLevelPath when path is found', async () => {
    revparse.mockImplementationOnce(() => '/path/to/project');

    await expect(getTopLevelPath('/path/to/file.js')).resolves.toBe(
      '/path/to/project'
    );
  });
});

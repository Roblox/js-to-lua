import { SimpleGit } from 'simple-git';
import * as lp from 'lookpath';
import * as versionManager from './version-manager';
import * as fs from 'fs';
import * as childProcess from 'node:child_process';
import * as simpleGit from 'simple-git';
import { ExecException, ExecFileException } from 'child_process';

type execType = (
  command: string,
  callback?: (
    error: ExecException | null,
    stdout: string,
    stderr: string
  ) => void
) => void;

type execFileType = (
  file: string,
  args: ReadonlyArray<string> | undefined | null,
  callback: (
    error: ExecFileException | null,
    stdout: string,
    stderr: string
  ) => void
) => void;

describe('versionManager', () => {
  let exec: jest.SpyInstance,
    cwd: jest.Mock,
    clone: jest.Mock,
    checkout: jest.Mock,
    fetch: jest.Mock,
    checkIsRepo: jest.Mock,
    rm: jest.Mock;

  beforeEach(() => {
    exec = (
      jest.spyOn(
        childProcess,
        'exec'
      ) as unknown as jest.MockedFunction<execType>
    ).mockImplementation((command, callback) => {
      if (callback) {
        callback(null, '', '');
      }
    });
    (
      jest.spyOn(
        childProcess,
        'execFile'
      ) as unknown as jest.MockedFunction<execFileType>
    ).mockImplementation((file, args, callback) => {
      if (callback) {
        callback(null, '', '');
      }
    });
    cwd = jest.fn();
    clone = jest.fn();
    checkout = jest.fn();
    fetch = jest.fn();
    checkIsRepo = jest.fn();
    jest.spyOn(lp, 'lookpath').mockReturnValue(Promise.resolve('/fake-path'));
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    rm = jest.fn();
    jest.spyOn(process, 'chdir');
    jest
      .spyOn(fs, 'promises', 'get')
      .mockReturnValue({ rm } as unknown as typeof fs.promises);
    jest.spyOn(simpleGit, 'simpleGit').mockReturnValue({
      cwd,
      clone,
      checkout,
      fetch,
      checkIsRepo,
    } as unknown as SimpleGit);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be able to find a repository root when in a subdirectory', async () => {
    checkIsRepo = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(true))
      .mockReturnValueOnce(Promise.resolve(false))
      .mockReturnValueOnce(Promise.resolve(true));

    jest
      .spyOn(simpleGit, 'simpleGit')
      .mockImplementation(
        jest.fn(() => ({ cwd, checkIsRepo } as unknown as SimpleGit))
      );

    const result = await versionManager.findRepositoryRoot(
      '/repo-root/subdirectory'
    );
    expect(result).toBe('/repo-root');

    expect(cwd).toHaveBeenNthCalledWith(1, '/repo-root/subdirectory');
    expect(cwd).toHaveBeenNthCalledWith(2, '/repo-root');
  });

  it('should not return a repository root if not in a repository', async () => {
    checkIsRepo = jest.fn().mockReturnValue(Promise.resolve(false));

    jest
      .spyOn(simpleGit, 'simpleGit')
      .mockImplementation(
        jest.fn(() => ({ cwd, checkIsRepo } as unknown as SimpleGit))
      );

    const result = await versionManager.findRepositoryRoot(
      '/repo-root/subdirectory'
    );
    expect(result).toBeUndefined();

    expect(cwd).toHaveBeenNthCalledWith(1, '/repo-root/subdirectory');
  });

  it('should clone and initiate installation of the conversion tool', async () => {
    await versionManager.setupConversionTool('fake-branch-name');

    expect(clone).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledWith('npm run build:prod', expect.anything());
  });

  it('should not install if wasm-pack is missing', async () => {
    jest.spyOn(lp, 'lookpath').mockReturnValue(Promise.resolve(undefined));

    await expect(async () =>
      versionManager.setupConversionTool('fake-branch-name')
    ).rejects.toThrow();

    expect(clone).toHaveBeenCalledTimes(0);
    expect(exec).not.toHaveBeenCalledWith(
      'npm run build:stylua-wasm',
      expect.anything()
    );
  });

  it('should delete the cloned repo if the build process fails', async () => {
    (
      jest.spyOn(
        childProcess,
        'exec'
      ) as unknown as jest.MockedFunction<execType>
    ).mockImplementation((command, callback) => {
      if (callback) {
        callback(new Error('Mock error'), '', '');
      }
    });

    await expect(async () =>
      versionManager.setupConversionTool('fake-branch-name')
    ).rejects.toThrow();

    expect(rm).toHaveBeenCalledTimes(2);
  });

  it('should update if the repo already exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    await versionManager.setupConversionTool('fake-branch-name');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(clone).toHaveBeenCalledTimes(0);
    expect(exec).toHaveBeenCalledWith('npm run build:prod', expect.anything());
  });
});

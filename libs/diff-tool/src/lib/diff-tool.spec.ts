import { ConversionConfig } from '@roblox/release-tracker';
import * as childProcess from 'child_process';
import {
  ExecException,
  ExecFileException,
  ExecFileOptions,
} from 'child_process';
import * as fs from 'fs';
import { PathLike } from 'fs';
import * as fsPromises from 'fs/promises';
import * as lp from 'lookpath';
import * as os from 'os';
import * as simpleGit from 'simple-git';
import { MergeResult, SimpleGit } from 'simple-git';
import * as diffTool from './diff-tool';

const MOCK_CONFIG: ConversionConfig = {
  lastSync: {
    ref: '63e506b5d1558a9132a8fa65151407b0a40be3a5',
    conversionToolVersion: 'ee85735b8dcec492526c85830d5d9fc6fc42f2a0',
  },
  upstream: {
    owner: 'facebook',
    repo: 'jest',
    primaryBranch: 'main',
  },
  downstream: {
    owner: 'roblox',
    repo: 'jest-roblox',
    primaryBranch: 'master',
    patterns: ['src/**/*.lua'],
  },
};

const MOCK_TOOL_PATH = '/path/to/tool';
const MOCK_TOOL_CMD_PATH = 'dist/apps/convert-js-to-lua/main.js';
const MOCK_TMP_DIR = 'mocked/tmp';
const MOCK_UPSTREAM_PATH = '/path/to/upstream';
const MOCK_DOWNSTREAM_PATH = '/path/to/downstream';
const MOCK_REMOTE_URL = 'https://github.com/owner/repo';
const MOCK_JS_TO_LUA_OPTIONS = {
  remoteUrl: MOCK_REMOTE_URL,
};
const MOCK_COMPARE_OPTIONS = { outDir: 'mock-output-path' };
const FF_CONVERSION_FOLDER = 'fast-follow-conversion';

jest.mock(
  'glob',
  () =>
    (
      _pattern: string,
      _opts: Record<string, unknown>,
      cb: (err: Error | null, paths: string[]) => void
    ) =>
      cb(null, ['boo'])
);

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
  options: ExecFileOptions,
  callback: (
    error: ExecFileException | null,
    stdout: string,
    stderr: string
  ) => void
) => void;

describe('diffTool', () => {
  let execFile: jest.SpyInstance,
    gitCwd: jest.Mock,
    branch: jest.Mock,
    applyPatch: jest.Mock,
    checkIsRepo: jest.Mock,
    checkout: jest.Mock,
    checkoutBranch: jest.Mock,
    revparse: jest.Mock,
    add: jest.Mock,
    commit: jest.Mock,
    raw: jest.Mock,
    mergeFromTo: jest.Mock,
    diff: jest.Mock,
    show: jest.Mock,
    init: jest.Mock,
    deleteLocalBranch: jest.Mock,
    mkdirSpy: jest.SpyInstance;

  beforeEach(() => {
    let workingDir = '/';

    (
      jest.spyOn(
        childProcess,
        'exec'
      ) as unknown as jest.MockedFunction<execType>
    ).mockImplementation((command, callback) => {
      if (callback) {
        callback(null, '', '');
      }
    });
    execFile = (
      jest.spyOn(
        childProcess,
        'execFile'
      ) as unknown as jest.MockedFunction<execFileType>
    ).mockImplementation((file, args, options, callback) => {
      if (callback) {
        callback(null, '', '');
      }
    });

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'statSync').mockReturnValue(new fs.Stats());
    jest.spyOn(fs.Stats.prototype, 'isDirectory').mockReturnValue(true);
    jest.spyOn(fs, 'mkdirSync').mockImplementation();
    jest.spyOn(fs, 'readdirSync').mockReturnValue([]);
    jest.spyOn(fs, 'copyFileSync').mockImplementation();
    jest.spyOn(fsPromises, 'rm').mockImplementation();
    mkdirSpy = jest.spyOn(fsPromises, 'mkdir').mockImplementation();
    jest.spyOn(fsPromises, 'readdir').mockResolvedValue([]);
    jest
      .spyOn(fsPromises, 'realpath')
      .mockImplementation((path: PathLike) => Promise.resolve(path as string));
    jest
      .spyOn(fsPromises, 'readFile')
      .mockImplementation((path) =>
        typeof path === 'string' && path.includes('foreman.toml')
          ? Promise.resolve(
              '[tools]\nstylua = { source = "JohnnyMorganz/StyLua", version = "=0.14.2" }'
            )
          : Promise.resolve(
              '-- ROBLOX upstream: https://github.com/facebook/jest/blob/test/boo.js\n'
            )
      );
    jest.spyOn(fsPromises, 'writeFile').mockImplementation();
    jest.spyOn(fsPromises, 'copyFile').mockImplementation();
    jest.spyOn(lp, 'lookpath').mockReturnValue(Promise.resolve('/fake-path'));

    jest.spyOn(process, 'chdir').mockImplementation((directory) => {
      workingDir = directory;
    });
    jest.spyOn(process, 'cwd').mockImplementation(() => workingDir);

    gitCwd = jest.fn();
    branch = jest.fn();
    applyPatch = jest.fn();
    checkIsRepo = jest.fn().mockReturnValue(true);
    checkout = jest.fn();
    checkoutBranch = jest.fn();
    revparse = jest.fn().mockReturnValue('1234567');
    add = jest.fn();
    commit = jest.fn();
    raw = jest.fn();
    mergeFromTo = jest.fn(() =>
      Promise.resolve({ conflicts: [] } as unknown as MergeResult)
    );
    diff = jest.fn(() => '');
    show = jest.fn();
    init = jest.fn();
    deleteLocalBranch = jest.fn();

    jest.spyOn(simpleGit, 'simpleGit').mockReturnValue({
      cwd: gitCwd,
      branch,
      applyPatch,
      checkIsRepo,
      checkout,
      checkoutBranch,
      revparse,
      add,
      commit,
      raw,
      mergeFromTo,
      diff,
      show,
      init,
      deleteLocalBranch,
    } as unknown as SimpleGit);

    jest.spyOn(os, 'tmpdir').mockReturnValue(MOCK_TMP_DIR);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should use the conversion tool to convert sources', async () => {
    await diffTool.compare(
      MOCK_CONFIG,
      MOCK_TOOL_PATH,
      MOCK_UPSTREAM_PATH,
      MOCK_DOWNSTREAM_PATH,
      MOCK_COMPARE_OPTIONS,
      MOCK_JS_TO_LUA_OPTIONS
    );

    expect(add).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledTimes(4);
    expect(branch).toHaveBeenCalledTimes(1);
    expect(branch).toHaveBeenCalledWith(['-m', 'main']);
    expect(mergeFromTo).toHaveBeenCalledTimes(1);
    expect(diff).toHaveBeenCalledWith(['HEAD~1']);
    expect(execFile).toHaveBeenCalledTimes(2);
    expect(execFile).toHaveBeenCalledWith(
      'node',
      [
        MOCK_TOOL_CMD_PATH,
        '-o',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/output`,
        '-i',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/input/test/**/*`,
        '--rootDir',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/input/test`,
        '--remoteUrl',
        MOCK_REMOTE_URL,
        '--sha',
        'test',
      ],
      expect.objectContaining({ maxBuffer: Infinity }),
      expect.any(Function)
    );
    expect(execFile).toHaveBeenCalledWith(
      'node',
      [
        MOCK_TOOL_CMD_PATH,
        '-o',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/output`,
        '-i',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/input/main/**/*`,
        '--rootDir',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/input/main`,
        '--remoteUrl',
        MOCK_REMOTE_URL,
        '--sha',
        'main',
      ],
      expect.objectContaining({ maxBuffer: Infinity }),
      expect.any(Function)
    );
  });

  it('should fail to convert if not done within an actual repository', async () => {
    checkIsRepo = jest.fn().mockReturnValue(false);

    jest.spyOn(simpleGit, 'simpleGit').mockReturnValue({
      cwd: gitCwd,
      checkIsRepo,
      checkout,
      checkoutBranch,
      revparse,
      add,
      commit,
      raw,
      mergeFromTo,
      diff,
      show,
      init,
      deleteLocalBranch,
    } as unknown as SimpleGit);

    await expect(async () =>
      diffTool.compare(
        MOCK_CONFIG,
        MOCK_TOOL_PATH,
        MOCK_UPSTREAM_PATH,
        MOCK_DOWNSTREAM_PATH,
        MOCK_COMPARE_OPTIONS,
        MOCK_JS_TO_LUA_OPTIONS
      )
    ).rejects.toThrow(
      `Unable to run conversion for '${MOCK_DOWNSTREAM_PATH}': destination directory is not a git repository`
    );
  });

  it('should fail if given a config with no source patterns', async () => {
    const config: ConversionConfig = JSON.parse(JSON.stringify(MOCK_CONFIG));
    config.downstream.patterns = [];

    await expect(async () =>
      diffTool.compare(
        config,
        MOCK_TOOL_PATH,
        MOCK_UPSTREAM_PATH,
        MOCK_DOWNSTREAM_PATH,
        MOCK_COMPARE_OPTIONS,
        MOCK_JS_TO_LUA_OPTIONS
      )
    ).rejects.toThrow(
      `Unable to run conversion for '${MOCK_DOWNSTREAM_PATH}': no source patterns are specified in the downstream conversion config`
    );
  });

  it('should rethrow error if mkdir fails', async () => {
    mkdirSpy.mockImplementation(() =>
      Promise.reject(new Error('Something terrible happened'))
    );
    await expect(async () =>
      diffTool.compare(
        MOCK_CONFIG,
        MOCK_TOOL_PATH,
        MOCK_UPSTREAM_PATH,
        MOCK_DOWNSTREAM_PATH,
        MOCK_COMPARE_OPTIONS,
        MOCK_JS_TO_LUA_OPTIONS
      )
    ).rejects.toThrow('Something terrible happened');
  });

  it('plugins are used as js-to-lua arguments', async () => {
    await diffTool.compare(
      MOCK_CONFIG,
      MOCK_TOOL_PATH,
      MOCK_UPSTREAM_PATH,
      MOCK_DOWNSTREAM_PATH,
      MOCK_COMPARE_OPTIONS,
      {
        ...MOCK_JS_TO_LUA_OPTIONS,
        plugins: ['foo', 'bar', 'baz'],
      }
    );

    expect(execFile).toHaveBeenCalledWith(
      'node',
      [
        MOCK_TOOL_CMD_PATH,
        '-o',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/output`,
        '-i',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/input/test/**/*`,
        '--rootDir',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/input/test`,
        '--remoteUrl',
        MOCK_REMOTE_URL,
        '--sha',
        'test',
        '--plugin',
        'foo',
        '--plugin',
        'bar',
        '--plugin',
        'baz',
      ],
      expect.objectContaining({ maxBuffer: Infinity }),
      expect.any(Function)
    );
    expect(execFile).toHaveBeenCalledWith(
      'node',
      [
        MOCK_TOOL_CMD_PATH,
        '-o',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/output`,
        '-i',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/input/main/**/*`,
        '--rootDir',
        `${MOCK_TMP_DIR}/${FF_CONVERSION_FOLDER}/input/main`,
        '--remoteUrl',
        MOCK_REMOTE_URL,
        '--sha',
        'main',
        '--plugin',
        'foo',
        '--plugin',
        'bar',
        '--plugin',
        'baz',
      ],
      expect.objectContaining({ maxBuffer: Infinity }),
      expect.any(Function)
    );
  });
});

import * as diffTool from './diff-tool';
import * as simpleGit from 'simple-git';
import * as lp from 'lookpath';
import * as childProcess from 'node:child_process';
import * as fs from 'fs';
import { MergeResult, SimpleGit } from 'simple-git';
import { ConversionConfig } from '@roblox/release-tracker';
import { ExecException, ExecFileException } from 'child_process';
import { ExecFileOptions } from 'node:child_process';

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
const MOCK_TOOL_CMD_PATH = `${MOCK_TOOL_PATH}/dist/apps/convert-js-to-lua/main.js`;
const MOCK_UPSTREAM_PATH = '/path/to/upstream';
const MOCK_DOWNSTREAM_PATH = '/path/to/downstream';

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
    deleteLocalBranch: jest.Mock;

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
    jest.spyOn(fs.promises, 'rm').mockImplementation();
    jest.spyOn(fs.promises, 'mkdir').mockImplementation();
    jest.spyOn(fs.promises, 'readdir').mockResolvedValue([]);
    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation((path) =>
        typeof path === 'string' && path.includes('foreman.toml')
          ? Promise.resolve(
              '[tools]\nstylua = { source = "JohnnyMorganz/StyLua", version = "=0.14.2" }'
            )
          : Promise.resolve('')
      );
    jest.spyOn(fs.promises, 'writeFile').mockImplementation();
    jest.spyOn(fs.promises, 'copyFile').mockImplementation();
    jest.spyOn(lp, 'lookpath').mockReturnValue(Promise.resolve('/fake-path'));

    jest.spyOn(process, 'chdir').mockImplementation((directory) => {
      workingDir = directory;
    });
    jest.spyOn(process, 'cwd').mockImplementation(() => workingDir);

    gitCwd = jest.fn();
    branch = jest.fn();
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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should use the conversion tool to convert sources', async () => {
    await diffTool.compare(
      MOCK_CONFIG,
      MOCK_TOOL_PATH,
      MOCK_UPSTREAM_PATH,
      MOCK_DOWNSTREAM_PATH
    );

    expect(add).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledTimes(4);
    expect(branch).toHaveBeenCalledTimes(1);
    expect(branch).toHaveBeenCalledWith(['-m', 'main']);
    expect(mergeFromTo).toHaveBeenCalledTimes(1);
    expect(diff).toHaveBeenCalledWith(['HEAD~1']);
    expect(execFile).toHaveBeenCalledWith(
      'node',
      [MOCK_TOOL_CMD_PATH, '-o', 'output', '-i', '**/*'],
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
        MOCK_DOWNSTREAM_PATH
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
        MOCK_DOWNSTREAM_PATH
      )
    ).rejects.toThrow(
      `Unable to run conversion for '${MOCK_DOWNSTREAM_PATH}': no source patterns are specified in the downstream conversion config`
    );
  });
});

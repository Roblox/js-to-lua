import * as diffTool from './diff-tool';
import * as simpleGit from 'simple-git';
import * as childProcess from 'node:child_process';
import * as fs from 'fs';
import { SimpleGit } from 'simple-git';
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
    patterns: ['packages/**/*.js', 'packages/**/*.ts'],
  },
  downstream: {
    primaryBranch: 'master',
  },
};

const MOCK_TOOL_PATH = '/path/to/tool';
const MOCK_TOOL_CMD_PATH = `${MOCK_TOOL_PATH}/dist/apps/convert-js-to-lua/main.js`;
const MOCK_DESTINATION_BRANCH = 'destination-branch';
const MOCK_UPSTREAM_PATH = '/path/to/upstream';
const MOCK_DOWNSTREAM_PATH = '/path/to/downstream';

const MOCK_OLD_TOOL_PATH = '/path/to/old/tool';
const MOCK_OLD_TOOL_CMD_PATH = `${MOCK_OLD_TOOL_PATH}/dist/apps/convert-js-to-lua/main.js`;

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
    rm: jest.SpyInstance,
    gitCwd: jest.Mock,
    checkIsRepo: jest.Mock,
    checkout: jest.Mock,
    checkoutBranch: jest.Mock,
    revparse: jest.Mock,
    add: jest.Mock,
    commit: jest.Mock,
    raw: jest.Mock,
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
    rm = jest.spyOn(fs.promises, 'rm').mockImplementation();

    jest.spyOn(process, 'chdir').mockImplementation((directory) => {
      workingDir = directory;
    });
    jest.spyOn(process, 'cwd').mockImplementation(() => workingDir);

    gitCwd = jest.fn();
    checkIsRepo = jest.fn().mockReturnValue(true);
    checkout = jest.fn();
    checkoutBranch = jest.fn();
    revparse = jest.fn().mockReturnValue('1234567');
    add = jest.fn();
    commit = jest.fn();
    raw = jest.fn();
    deleteLocalBranch = jest.fn();

    jest.spyOn(simpleGit, 'simpleGit').mockReturnValue({
      cwd: gitCwd,
      checkIsRepo,
      checkout,
      checkoutBranch,
      revparse,
      add,
      commit,
      raw,
      deleteLocalBranch,
    } as unknown as SimpleGit);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be able to use the conversion tool to convert sources', async () => {
    await diffTool.convert(
      MOCK_CONFIG,
      MOCK_TOOL_PATH,
      MOCK_DESTINATION_BRANCH,
      MOCK_UPSTREAM_PATH,
      MOCK_DOWNSTREAM_PATH,
      MOCK_CONFIG.downstream.primaryBranch
    );

    expect(gitCwd).toHaveBeenNthCalledWith(1, MOCK_UPSTREAM_PATH);
    expect(checkout).toHaveBeenCalledWith(MOCK_CONFIG.upstream.primaryBranch);

    expect(gitCwd).toHaveBeenNthCalledWith(2, MOCK_DOWNSTREAM_PATH);
    expect(checkoutBranch).toHaveBeenCalledWith(
      MOCK_DESTINATION_BRANCH,
      MOCK_CONFIG.downstream.primaryBranch
    );
    expect(add).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledTimes(1);

    expect(execFile).toHaveBeenCalledWith(
      'node',
      [MOCK_TOOL_CMD_PATH, '-o', 'output', '-i'].concat(
        MOCK_CONFIG.upstream.patterns
      ),
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
      deleteLocalBranch,
    } as unknown as SimpleGit);

    await expect(async () =>
      diffTool.convert(
        MOCK_CONFIG,
        MOCK_TOOL_PATH,
        MOCK_DESTINATION_BRANCH,
        MOCK_UPSTREAM_PATH,
        MOCK_DOWNSTREAM_PATH,
        MOCK_CONFIG.downstream.primaryBranch
      )
    ).rejects.toThrow(
      `Unable to run conversion for '${MOCK_UPSTREAM_PATH}': destination directory is not a git repository`
    );
  });

  it('should fail if given a config with no source patterns', async () => {
    const config: ConversionConfig = JSON.parse(JSON.stringify(MOCK_CONFIG));
    config.upstream.patterns = [];

    await expect(async () =>
      diffTool.convert(
        config,
        MOCK_TOOL_PATH,
        MOCK_DESTINATION_BRANCH,
        MOCK_UPSTREAM_PATH,
        MOCK_DOWNSTREAM_PATH,
        MOCK_CONFIG.downstream.primaryBranch
      )
    ).rejects.toThrow(
      `Unable to run conversion for '${MOCK_UPSTREAM_PATH}': no source patterns are specified in the downstream conversion config`
    );
  });

  it('should clean up the output directory whenever the conversion fails', async () => {
    const config: ConversionConfig = JSON.parse(JSON.stringify(MOCK_CONFIG));
    config.upstream.patterns = [];

    await expect(async () =>
      diffTool.convert(
        config,
        MOCK_TOOL_PATH,
        MOCK_DESTINATION_BRANCH,
        MOCK_UPSTREAM_PATH,
        MOCK_DOWNSTREAM_PATH,
        MOCK_CONFIG.downstream.primaryBranch
      )
    ).rejects.toThrow(
      `Unable to run conversion for '${MOCK_UPSTREAM_PATH}': no source patterns are specified in the downstream conversion config`
    );

    expect(rm).toHaveBeenCalledWith(
      `${MOCK_UPSTREAM_PATH}/output`,
      expect.objectContaining({ recursive: true, force: true })
    );
  });

  it('should compare with two different versions of the conversion tool', async () => {
    await diffTool.compare(
      MOCK_CONFIG,
      MOCK_OLD_TOOL_PATH,
      MOCK_TOOL_PATH,
      MOCK_UPSTREAM_PATH,
      MOCK_DOWNSTREAM_PATH
    );

    expect(execFile).toHaveBeenCalledTimes(2);
    expect(execFile).toHaveBeenNthCalledWith(
      1,
      'node',
      [MOCK_OLD_TOOL_CMD_PATH, '-o', 'output', '-i'].concat(
        MOCK_CONFIG.upstream.patterns
      ),
      expect.objectContaining({ maxBuffer: Infinity }),
      expect.any(Function)
    );
    expect(execFile).toHaveBeenNthCalledWith(
      2,
      'node',
      [MOCK_TOOL_CMD_PATH, '-o', 'output', '-i'].concat(
        MOCK_CONFIG.upstream.patterns
      ),
      expect.objectContaining({ maxBuffer: Infinity }),
      expect.any(Function)
    );

    expect(raw).toHaveBeenCalledWith(
      expect.arrayContaining(['format-patch', '-1', 'HEAD', '--stdout'])
    );
  });

  it('should cleanup after failing to commit due to downstream not being a git repo', async () => {
    const config: ConversionConfig = JSON.parse(JSON.stringify(MOCK_CONFIG));
    let inDownstreamPath = false;

    gitCwd = jest.fn().mockImplementation((directory: string) => {
      inDownstreamPath = directory === MOCK_DOWNSTREAM_PATH;
    });
    checkIsRepo = jest.fn().mockImplementation(() => !inDownstreamPath);

    jest.spyOn(simpleGit, 'simpleGit').mockReturnValue({
      cwd: gitCwd,
      checkIsRepo,
      checkout,
      checkoutBranch,
      revparse,
      add,
      commit,
      raw,
      deleteLocalBranch,
    } as unknown as SimpleGit);

    await expect(async () =>
      diffTool.convert(
        config,
        MOCK_TOOL_PATH,
        MOCK_DESTINATION_BRANCH,
        MOCK_UPSTREAM_PATH,
        MOCK_DOWNSTREAM_PATH,
        MOCK_CONFIG.downstream.primaryBranch
      )
    ).rejects.toThrow(
      `Unable to commit transpiled sources into '${MOCK_DOWNSTREAM_PATH}': destination directory is not a git repository`
    );

    expect(rm).toHaveBeenCalledWith(
      `${MOCK_UPSTREAM_PATH}/output`,
      expect.objectContaining({ recursive: true, force: true })
    );
  });
});
import { ConversionConfig } from '@roblox/release-tracker';
import * as fs from 'fs';
import { renameFiles } from './rename-files';

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
    primaryBranch: 'master',
    patterns: ['src/**/*.lua'],
  },
  renameFiles: [
    [
      (filename) => filename.endsWith('index.lua'),
      (filename) => filename.replace('index.lua', 'init.lua'),
    ],
  ],
};

describe('rename-files', function () {
  const readDirSpy = jest.spyOn(fs.promises, 'readdir');
  const statSyncSpy = jest.spyOn(fs, 'statSync');
  const renameSpy = jest.spyOn(fs.promises, 'rename').mockImplementation(() => {
    return Promise.resolve();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should rename files that match condition', async function () {
    readDirSpy.mockResolvedValueOnce(['foo/index.lua'] as any[]);
    statSyncSpy.mockReturnValueOnce({ isDirectory: () => false } as fs.Stats);
    await renameFiles('.', MOCK_CONFIG);
    expect(renameSpy).toHaveBeenCalledTimes(1);
    expect(renameSpy).toHaveBeenCalledWith('foo/index.lua', 'foo/init.lua');
  });

  it('should rename files with concatenated conditions', async function () {
    const config: ConversionConfig = MOCK_CONFIG.renameFiles
      ? {
          ...MOCK_CONFIG,
          renameFiles: [
            ...MOCK_CONFIG.renameFiles,
            [
              (filename) => filename.endsWith('init.lua'),
              (filename) => filename.replace('init.lua', 'foo.lua'),
            ],
          ],
        }
      : MOCK_CONFIG;

    readDirSpy.mockResolvedValueOnce(['foo/index.lua'] as any[]);
    statSyncSpy.mockReturnValueOnce({ isDirectory: () => false } as fs.Stats);

    await renameFiles('.', config);

    expect(renameSpy).toHaveBeenCalledTimes(2);
    expect(renameSpy).toHaveBeenCalledWith('foo/index.lua', 'foo/init.lua');
    expect(renameSpy).toHaveBeenCalledWith('foo/init.lua', 'foo/foo.lua');
  });

  it('should not rename files that do not match condition', async function () {
    readDirSpy.mockResolvedValueOnce(['foo/index1.lua'] as any[]);
    statSyncSpy.mockReturnValueOnce({ isDirectory: () => false } as fs.Stats);
    await renameFiles('.', MOCK_CONFIG);
    expect(renameSpy).not.toHaveBeenCalled();
  });

  it('should ignore folders', async function () {
    readDirSpy
      .mockResolvedValueOnce(['index.lua/'] as any[])
      .mockResolvedValueOnce([] as any[]);
    statSyncSpy.mockReturnValueOnce({ isDirectory: () => true } as fs.Stats);
    await renameFiles('.', MOCK_CONFIG);
    expect(renameSpy).not.toHaveBeenCalled();
  });
});

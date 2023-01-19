import * as utils from '@js-to-lua/upstream-utils';
import * as fsPromise from 'fs/promises';
import { attemptFixPatch } from './attempt-fix-patch';

jest.mock('@js-to-lua/upstream-utils');
const PATCH_PATH = 'path/to/patch';
const FAILED_FILEPATH = 'src/test2.lua';

const MOCK_PATCH_FILE_CONTENT = `diff --git a/src/test.lua b/src/test.lua
index 9506e04..e4a2b53 100644
--- a/src/test.lua
+++ b/src/test.lua
@@ -1,4 +1,4 @@
--- OK
+-- NOT OK
 ...

 ...
`;

const MOCK_PATCH_FILE_CONTENT_WONT_PATCH = `diff --git a/${FAILED_FILEPATH} b/${FAILED_FILEPATH}
index 9506e04..e4a2b53 100644
--- a/${FAILED_FILEPATH}
+++ b/${FAILED_FILEPATH}
@@ -1,4 +1,4 @@
--- OK
+-- NOT OK
 ...

 ...
`;

let writeSpy: jest.SpyInstance;
let readSpy: jest.SpyInstance;
describe('attemptFixPatch', () => {
  const mockUtils = utils as jest.Mocked<typeof utils>;

  beforeEach(() => {
    writeSpy = jest.spyOn(fsPromise, 'writeFile').mockImplementation();
    readSpy = jest.spyOn(fsPromise, 'readFile').mockImplementation();
    jest.spyOn(fsPromise, 'copyFile').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should not change contents if patch cleanly applies', async () => {
    readSpy.mockImplementation(() => {
      return MOCK_PATCH_FILE_CONTENT;
    });
    mockUtils.applyPatch.mockImplementation(() => Promise.resolve('mocked'));

    const result = await attemptFixPatch('someRepo', PATCH_PATH);
    expect(readSpy).toHaveBeenCalledTimes(1);
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(writeSpy).toHaveBeenCalledWith(PATCH_PATH, MOCK_PATCH_FILE_CONTENT, {
      encoding: 'utf8',
    });
    expect(result).toEqual({
      failedFiles: expect.any(Set),
      patchPath: PATCH_PATH,
    });
  });

  it('should retry to patch files', async () => {
    readSpy.mockImplementation(() => {
      return MOCK_PATCH_FILE_CONTENT + MOCK_PATCH_FILE_CONTENT_WONT_PATCH;
    });
    mockUtils.applyPatch
      .mockImplementationOnce(() =>
        Promise.reject({
          message: `error: ${FAILED_FILEPATH}: something failed`,
        })
      )
      .mockImplementation(() => Promise.resolve('mocked'));

    const result = await attemptFixPatch('someRepo', PATCH_PATH);
    expect(readSpy).toHaveBeenCalledTimes(2);
    expect(writeSpy).toHaveBeenCalledTimes(2);
    expect(writeSpy.mock.calls[1]).toEqual([
      PATCH_PATH,
      MOCK_PATCH_FILE_CONTENT,
      { encoding: 'utf8' },
    ]);
    expect(result).toEqual({
      failedFiles: expect.any(Set),
      patchPath: PATCH_PATH,
    });
  });
});

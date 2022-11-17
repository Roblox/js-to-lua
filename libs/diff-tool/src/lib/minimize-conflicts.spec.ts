import { Stats } from 'fs';
import * as fs from 'fs';
import * as git from './get-branch-file';
import { minimizeConflicts } from './minimize-conflicts';
import mocked = jest.mocked;

jest.mock('fs');
jest.mock('./get-branch-file');

const fsMocked = mocked(fs);
const gitMocked = mocked(git);

beforeEach(() => {
  fsMocked.readdirSync.mockImplementation(() => ['aFile.lua'] as any);
  fsMocked.statSync.mockReturnValue({
    isDirectory: () => false,
  } as Stats);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('minimize conflicts', function () {
  describe('comments only', function () {
    const downstream = `
    -- ROBLOX deviation START: skipped
    -- local foo = 1
    -- local bar = 2
    -- ROBLOX deviation END

    `;

    it('should replace deviation START/END section if match is found in converted file', async function () {
      const convertedFileContent = `
    local foo = 1
    local bar = 2

    `;

      fsMocked.readFileSync.mockReturnValue(convertedFileContent);
      gitMocked.getBranchFile.mockResolvedValue(downstream);
      await minimizeConflicts('downstream', 'test');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.anything(),
        downstream
      );
    });

    it('should not replace deviation START/END section if more than one match is found in converted file', async function () {
      const convertedFileContent = `
    local foo = 1
    local bar = 2

    local function foo()
        local foo = 1
        local bar = 2
    end

    `;

      fsMocked.readFileSync.mockReturnValue(convertedFileContent);
      gitMocked.getBranchFile.mockResolvedValue(downstream);
      await minimizeConflicts('downstream', 'test');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.anything(),
        convertedFileContent
      );
    });
  });

  describe('mixed comments and code', function () {
    const downstream = `
-- ROBLOX deviation START: skipped
-- local foo = 1
-- local bar = 2
local bar = 3
-- ROBLOX deviation END

`;

    it('should not replace deviation START/END section if match is found in converted file and strict = true', async function () {
      const convertedFileContent = `
local foo = 1
local bar = 2

`;

      fsMocked.readFileSync.mockReturnValue(convertedFileContent);
      gitMocked.getBranchFile.mockResolvedValue(downstream);
      await minimizeConflicts('downstream', 'test');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.anything(),
        convertedFileContent
      );
    });

    it('should replace deviation START/END section if match is found in converted file and strict = false', async function () {
      const convertedFileContent = `
local foo = 1
local bar = 2

`;

      fsMocked.readFileSync.mockReturnValue(convertedFileContent);
      gitMocked.getBranchFile.mockResolvedValue(downstream);
      await minimizeConflicts('downstream', 'test', {
        strict: false,
      });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.anything(),
        downstream
      );
    });

    it('should not replace deviation START/END section if more than one match  is found in converted file and strict = false', async function () {
      const convertedFileContent = `
local foo = 1
local bar = 2

local function()
    local foo = 1
    local bar = 2
end

`;

      fsMocked.readFileSync.mockReturnValue(convertedFileContent);
      gitMocked.getBranchFile.mockResolvedValue(downstream);
      await minimizeConflicts('downstream', 'test', {
        strict: false,
      });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.anything(),
        convertedFileContent
      );
    });
  });
});

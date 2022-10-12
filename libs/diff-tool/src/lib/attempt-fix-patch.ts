import { applyPatch } from '@js-to-lua/upstream-utils';
import * as crypto from 'crypto';
import { copyFile, readFile, writeFile } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { GitError } from 'simple-git';

const PATCH_ERROR_REGEX = /^error: (.*):(.*)$/;
const DIFF_FILE_HEADER_REGEX = /^diff --git a\/output\/(.*) b\/output\/(.*)$/;

/**
 * Attempt to apply a patch to the target repository. Whenever files in the
 * unified diff fail to apply, they will be removed and the patch application
 * will be attempted again. This will happen either until the application
 * succeeds, or it gets stuck with the same error.
 */
export async function attemptFixPatch(
  targetRepository: string,
  patchPath: string
) {
  const newPatchFilename = `${crypto.randomBytes(16).toString('hex')}.patch`;
  const newPatchPath = path.join(os.tmpdir(), newPatchFilename);

  await copyFile(patchPath, newPatchPath);

  let allFailedFiles: Set<string> = new Set();
  let failedFiles: Set<string> = new Set();
  let lastError = '';
  let newPatchFile = await readFile(newPatchPath, { encoding: 'utf-8' });

  do {
    try {
      await applyPatch(targetRepository, newPatchPath, { check: true });

      failedFiles = new Set();
    } catch (e) {
      if (e instanceof GitError) {
        const message = e.message;

        if (message === lastError) {
          throw new Error(
            `fatal: cannot apply patch '${newPatchPath}': ${message}`
          );
        }

        lastError = message ?? '';
      }

      failedFiles = new Set(
        lastError
          .split('\n')
          .map((error) => (error.match(PATCH_ERROR_REGEX) ?? [])[1])
          .filter((filename): filename is string => !!filename)
      );
      allFailedFiles = new Set([...allFailedFiles, ...failedFiles]);

      newPatchFile = await removeFilesFromUnifiedDiff(newPatchPath, [
        ...failedFiles,
      ]);
      await writeFile(newPatchPath, newPatchFile, {
        encoding: 'utf8',
      });
    }
  } while (failedFiles.size > 0);

  await writeFile(patchPath, newPatchFile, {
    encoding: 'utf8',
  });

  return { patchPath, failedFiles: allFailedFiles };
}

async function removeFilesFromUnifiedDiff(
  patchPath: string,
  filenames: string[]
) {
  const patchContents = await readFile(patchPath, {
    encoding: 'utf8',
  });
  const filenameSet = new Set(filenames);

  let filteredPatch = '';
  let inBadFile = false;

  for (const line of patchContents.split('\n')) {
    if (line.startsWith('diff --git a/')) {
      const header = line.match(DIFF_FILE_HEADER_REGEX) ?? [];
      const beforePath = header[1];
      const afterPath = header[2];

      inBadFile = filenameSet.has(beforePath) || filenameSet.has(afterPath);
    }

    if (!inBadFile) {
      filteredPatch += line + '\n';
    }
  }

  return filteredPatch;
}

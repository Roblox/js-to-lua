import * as fs from 'fs';
import { parse, join, extname, ParsedPath } from 'path';
import { getBranchFile } from './get-branch-file';

function getAllFiles(directory: string): Array<string> {
  const dirContent = fs.readdirSync(directory);

  const allContent = dirContent.map((file: string) => {
    const filePath = join(directory, file);

    const fileStat = fs.statSync(filePath);
    if (fileStat.isDirectory()) {
      return getAllFiles(filePath);
    } else {
      return extname(file) == '.lua' ? [parse(filePath)] : [];
    }
  });

  return allContent
    .flat()
    .filter(Boolean)
    .map((file: ParsedPath | string) =>
      typeof file === 'string' ? file : join('.', file.dir, file.base)
    );
}

type RobloxComment = { line: string; lineNumber: number };
type RobloxCommentSection = { start?: RobloxComment; end?: RobloxComment };

/**
 *
 * @param {string} sourceBranch - the branch to compare to
 * @param {string} filePath - the filename to look for, if the path == ".", all files will be checked recursively
 * @param {Array} knownDeviations - TODO
 * @param {boolean} strict - whether the deviation should contain comments only or not
 * @param {boolean} debug - prints additional messages when logged
 */
export async function minimizeConflicts(
  sourceBranch: string,
  outputFolder: string,
  {
    knownDeviations = Array<[string, string]>(),
    strict = true,
    debug = false,
  } = {}
) {
  const filenames = getAllFiles(outputFolder);

  await Promise.all(
    filenames.map(async (filename) => {
      let downstreamContent;
      try {
        downstreamContent = await getBranchFile(
          sourceBranch,
          join('.', filename)
        );
      } catch (e) {
        console.log('failed to get file');
        console.log(e);
      }

      if (!downstreamContent) {
        return;
      }

      const filePath_ = join('.', filename);
      let newFileContent: string = fs.readFileSync(filePath_).toString();

      const lines = downstreamContent.split('\n');

      const robloxComments = [] as Array<RobloxComment>;
      lines.forEach((line, lineNumber) => {
        if (!line.trimStart().startsWith('-- ROBLOX')) {
          return;
        }

        robloxComments.push({ line: line.trim(), lineNumber });
      });

      if (debug) {
        console.log('\n##### ALL COMMENTS');
        console.log(robloxComments);
        console.log('#####\n');
      }

      const robloxSections = [] as Array<RobloxCommentSection>;
      let deviationStarted = false;
      let robloxSection = {} as RobloxCommentSection;

      robloxComments.forEach((comment) => {
        if (comment.line.startsWith('-- ROBLOX deviation START')) {
          if (!deviationStarted) {
            deviationStarted = true;
            robloxSection.start = comment;
          } else {
            console.warn(
              'Nested `ROBLOX deviation START` comment found, skipping outer deviation'
            );
            deviationStarted = true;
            robloxSection.start = comment;
          }
        } else if (
          comment.line.startsWith('-- ROBLOX deviation END') &&
          deviationStarted
        ) {
          robloxSection.end = comment;
          robloxSections.push({ ...robloxSection });
          robloxSection = {};
          deviationStarted = false;
        }
      });

      if (debug) {
        console.log('\n##### ALL SECTIONS');
        console.log(robloxSections);
        console.log('#####\n');
      }

      function isEveryLineInBetweenCommentedOut(section: RobloxCommentSection) {
        if (!section.start || !section.end) {
          return false;
        }
        if (!strict) {
          return true;
        }
        for (
          let i = section.start.lineNumber + 1;
          i < section.end.lineNumber;
          i++
        ) {
          if (!lines[i].trim().startsWith('--')) {
            return false;
          }
        }
        return true;
      }
      function escapeRegExp(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      function applyKnownDeviations() {
        knownDeviations.forEach(([match, replaceWith]) => {
          newFileContent = newFileContent.replace(
            new RegExp(escapeRegExp(match), 'g'),
            replaceWith
          );
        });
      }

      function applyDeviations(section: RobloxCommentSection) {
        if (!isEveryLineInBetweenCommentedOut(section)) {
          return;
        }

        if (!section.start || !section.end) {
          return;
        }

        // get comments that need to be matched with code in the converted file
        const matchLines = lines
          .slice((section.start.lineNumber || 0) + 1, section.end.lineNumber)
          .map((line) => line.trimStart())
          .filter((line) => line.startsWith('--'))
          .map(
            (line) => '[ \t]*' + escapeRegExp(line.slice(2).trim()) + '[ \t]*'
          )
          .join('\n');

        const replaceWith = lines
          .slice(section.start.lineNumber, section.end.lineNumber + 1)
          .join('\n');

        // Apply changes if there's only one match (otherwise what to replace is ambiguous)
        if (
          [...newFileContent.matchAll(new RegExp(matchLines, 'g'))].length === 1
        ) {
          newFileContent = newFileContent.replace(
            new RegExp(matchLines),
            replaceWith
          );
        }
      }

      robloxSections.forEach(applyDeviations);
      applyKnownDeviations();

      // write file
      fs.writeFileSync(filePath_, newFileContent);
    })
  );
}

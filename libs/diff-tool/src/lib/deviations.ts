export const DEVIATION_START = '-- ROBLOX deviation START';
export const DEVIATION_END = '-- ROBLOX deviation END';

const findDeviation = new RegExp(
  `(?<=${DEVIATION_START})` + // find a block that starts with our deviation syntax
    '(.*)\n' + // and anything up to the newline, which we capture as the comment
    '([\\s\\S]+?)' + // capture all non-whitespace and whitespace characters (that includes newlines)
    `\n\t*(?=${DEVIATION_END})`, // until the deviation block end
  'gm'
);

/**
 * Turns a block of code into an array of lines of code
 */
const toLines = (block: string): string[] => block.trim().split('\n');

/**
 * Creates a function that applies patch at given index
 */
const applyPatch =
  (
    lines: string[],
    rightStart: number,
    badLines: string[],
    deviationLines: string[]
  ) =>
  (patch: string, index: number): string => {
    let result = lines[rightStart + index].replace(
      patch,
      `-- ${badLines[index]}`
    );

    // Before we return the patched code, we might need to append implemented fixes
    let i = 1;
    while (
      deviationLines[index + i] &&
      (!deviationLines[index + i].includes(badLines[index + 1]) ||
        !badLines[index + 1])
    ) {
      result += `\n${deviationLines[index + i]}`;
      i++;
    }

    return result;
  };

/**
 * Indents {@link indent#code} based on the indentation in {@link indent#toMatch}
 */
const indent = (code: string, toMatch: string): string =>
  (toMatch?.match(/\t*/) || []).join('') + code;

/**
 * Looks for handled deviations on the left hand side and applies them to the right side
 *
 * @param left {string}  - left hand side of the comparison, also known as original/ours
 * @param right {string} - right hand side of the comparison, also known as incoming/theirs
 */

export const applyKnownDeviations = (left: string, right: string): string => {
  const deviationList = [...left.matchAll(findDeviation)];

  return deviationList.reduce((patchedRight, [, comment, deviation]) => {
    const lines = patchedRight.split('\n'); // all right lines
    const badCode = deviation
      .replaceAll(/^\t*/gm, '') // remove indentation
      .replaceAll(/^((?!-- ).*)$\n?/gm, '') // remove non-commented out lines
      .replaceAll(/^-- /gm, ''); // uncomment so we can look for them
    const flatRight = patchedRight.replaceAll(/^\t*/gm, '');
    const blockCharacterIndex = flatRight.indexOf(badCode); // The index of the first character indicating the block of troublesome code

    if (blockCharacterIndex === -1 || !badCode) {
      return patchedRight; // troublesome code is no longer in upstream, no need to patch
    }

    const deviationLines = toLines(deviation);
    const badLines = toLines(badCode);
    const rightStart = (
      flatRight.substring(0, blockCharacterIndex).match(/\n/g) || []
    ).length; // where the first matching line on the right side is
    const rightEnd = rightStart + badLines.length;

    const patchedLines = [
      ...lines.slice(0, rightStart), // Everything we have so far
      indent(DEVIATION_START + comment, lines[rightStart]), // Plus the start of the deviation comment
      ...badLines.map(applyPatch(lines, rightStart, badLines, deviationLines)), // Plus the patched code
      indent(
        (lines[rightEnd]?.includes('end') ? '\t' : '') + DEVIATION_END,
        lines[rightEnd]
      ), // Plus the deviation end comment, extra indent if block is ending on next line
      ...lines.slice(rightEnd), // Plus all code yet to come
    ];
    return patchedLines.join('\n');
  }, right);
};

// upstream: https://github.com/graphql/graphql-js/blob/1951bce42092123e844763b6a8e985a8a3327511/src/__testUtils__/dedent.js
// Licence file: LICENCE.graphqljs

/**
 * An ES6 string tag that fixes indentation. Also removes leading newlines
 * and trailing spaces and tabs, but keeps trailing newlines.
 *
 * Example usage:
 * const str = dedent`
 *   {
 *     test
 *   }
 * `;
 * str === "{\n  test\n}\n";
 */
export function dedent(
  strings: ReadonlyArray<string>,
  ...values: ReadonlyArray<string>
): string {
  let str = '';

  for (let i = 0; i < strings.length; ++i) {
    str += strings[i];
    if (i < values.length) {
      // istanbul ignore next (Ignore else inside Babel generated code)
      const value = values[i];

      str += value; // interpolation
    }
  }

  const trimmedStr = str
    .replace(/^\n*/m, '') //  remove leading newline
    .replace(/[ \t]*$/, ''); // remove trailing spaces and tabs

  // fixes indentation by removing leading spaces and tabs from each line
  let indent = '';
  for (const char of trimmedStr) {
    // We only remove spaces or tabs indents and we don't want to mix spaces and tabs
    if ((char !== ' ' && char !== '\t') || (indent && indent.at(0) !== char)) {
      break;
    }
    indent += char;
  }
  return trimmedStr.replace(RegExp('^' + indent, 'mg'), ''); // remove indent
}

import * as assert from 'assert';
import { curry } from 'ramda';

export const splitStringBy = curry(
  (pattern: RegExp, str: string): Array<string | string[]> => {
    const matches = Array.from(str.matchAll(pattern));

    if (!matches.length) {
      return [str];
    }

    let prevEnd = 0;
    let prevGroup: string[] | undefined;
    const res = Array<string | string[]>();

    for (const i in matches) {
      const match: RegExpMatchArray = matches[i];
      const [matchedStr] = match;
      const { index } = match;

      assert(index !== undefined, 'Match index should be a number');
      if (prevEnd === index && prevGroup) {
        prevGroup.push(matchedStr);
      } else {
        prevGroup = [matchedStr];
        if (prevEnd < index) {
          res.push(str.slice(prevEnd, index));
        }
        res.push(prevGroup);
      }
      prevEnd = index + matchedStr.length;
    }
    if (prevEnd < str.length) {
      res.push(str.slice(prevEnd));
    }

    return res;
  }
);

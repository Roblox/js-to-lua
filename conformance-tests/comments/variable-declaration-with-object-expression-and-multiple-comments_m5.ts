const bar = 'bar';
const baz = 'baz';
const rest = [1, 2, 3];
const bazValue = 'bazValue'

const foo /* comm 0 */ : /*comm 1*/ any /* comm 2 */ = /* comm 3 */ { bar, baz: bazValue } /* comm 4 */;
const foo1 /* comm 0 */ : /*comm 1*/ any /* comm 2 */ = /* comm 3 */ { bar, baz: bazValue, ...rest } /* comm 4 */;
const foo2 /* comm 0 */ : /*comm 1*/ any /* comm 2 */ = /* comm 3 */ bar /* comm 4 */;
const /* comm 0.0 */ foo3 /* comm 0.1 */ = /* comm 0.2 */ bar /* comm 0.3 */, /* comm 1.0 */ foo4 /* comm 1.1 */ = /* comm 1.2 */ baz /* comm 1.3 */;

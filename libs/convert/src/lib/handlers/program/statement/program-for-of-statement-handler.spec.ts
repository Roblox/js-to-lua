import {
  tableUnpackCall,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  breakStatement,
  callExpression,
  expressionStatement,
  forGenericStatement,
  identifier,
  indexExpression,
  memberExpression,
  nodeGroup,
  numericLiteral,
  tableConstructor,
  tableNoKeyField,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

describe('Program handler', () => {
  describe('For Of statement Handler', () => {
    it(`should handle empty loop`, () => {
      const source = `
        for(const foo of bar) {}
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('_'), identifier('foo')],
          [
            withTrailingConversionComment(
              callExpression(identifier('ipairs'), [identifier('bar')]),
              "ROBLOX CHECK: check if 'bar' is an Array"
            ),
          ],
          [nodeGroup([])]
        ),
      ]);

      convertProgram(source, {}, given);
      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle loop with body`, () => {
      const source = `
        for(const foo of bar) {
          foo()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('_'), identifier('foo')],
          [
            withTrailingConversionComment(
              callExpression(identifier('ipairs'), [identifier('bar')]),
              "ROBLOX CHECK: check if 'bar' is an Array"
            ),
          ],
          [
            nodeGroup([
              expressionStatement(callExpression(identifier('foo'), [])),
            ]),
          ]
        ),
      ]);

      convertProgram(source, {}, given);
      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle loop with body on definitely an array`, () => {
      const source = `
        for(const foo of [bar]) {
          foo()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('_'), identifier('foo')],
          [
            callExpression(identifier('ipairs'), [
              tableConstructor([tableNoKeyField(identifier('bar'))]),
            ]),
          ],
          [
            nodeGroup([
              expressionStatement(callExpression(identifier('foo'), [])),
            ]),
          ]
        ),
      ]);

      convertProgram(source, {}, given);
      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle nested loop`, () => {
      const source = `
        for(const foo of bar) {
          for(const fizz of buzz) {
            break
          }
          break
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('_'), identifier('foo')],
          [
            withTrailingConversionComment(
              callExpression(identifier('ipairs'), [identifier('bar')]),
              "ROBLOX CHECK: check if 'bar' is an Array"
            ),
          ],
          [
            nodeGroup([
              forGenericStatement(
                [identifier('_'), identifier('fizz')],
                [
                  withTrailingConversionComment(
                    callExpression(identifier('ipairs'), [identifier('buzz')]),
                    "ROBLOX CHECK: check if 'buzz' is an Array"
                  ),
                ],
                [nodeGroup([breakStatement()])]
              ),
              breakStatement(),
            ]),
          ]
        ),
      ]);

      convertProgram(source, {}, given);
      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle loop with identifier as left value', () => {
      const source = `
        for(foo of bar) {
          foo()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('_'), identifier('ref')],
          [
            withTrailingConversionComment(
              callExpression(identifier('ipairs'), [identifier('bar')]),
              "ROBLOX CHECK: check if 'bar' is an Array"
            ),
          ],
          [
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [identifier('ref')]
            ),
            nodeGroup([
              expressionStatement(callExpression(identifier('foo'), [])),
            ]),
          ]
        ),
      ]);

      convertProgram(source, {}, given);
      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle loop with object pattern as left value', () => {
      const source = `
        for({foo, bar} of buzz) {
          foo()
          bar()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('_'), identifier('ref')],
          [
            withTrailingConversionComment(
              callExpression(identifier('ipairs'), [identifier('buzz')]),
              "ROBLOX CHECK: check if 'buzz' is an Array"
            ),
          ],
          [
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo'), identifier('bar')],
              [
                memberExpression(identifier('ref'), '.', identifier('foo')),
                memberExpression(identifier('ref'), '.', identifier('bar')),
              ]
            ),
            nodeGroup([
              expressionStatement(callExpression(identifier('foo'), [])),
              expressionStatement(callExpression(identifier('bar'), [])),
            ]),
          ]
        ),
      ]);

      convertProgram(source, {}, given);
      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle loop with nested object pattern as left value', () => {
      const source = `
        for({foo, bar: {fizz}} of buzz) {
          foo()
          fizz()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('_'), identifier('ref')],
          [
            withTrailingConversionComment(
              callExpression(identifier('ipairs'), [identifier('buzz')]),
              "ROBLOX CHECK: check if 'buzz' is an Array"
            ),
          ],
          [
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo'), identifier('fizz')],
              [
                memberExpression(identifier('ref'), '.', identifier('foo')),
                memberExpression(
                  memberExpression(identifier('ref'), '.', identifier('bar')),
                  '.',
                  identifier('fizz')
                ),
              ]
            ),
            nodeGroup([
              expressionStatement(callExpression(identifier('foo'), [])),
              expressionStatement(callExpression(identifier('fizz'), [])),
            ]),
          ]
        ),
      ]);

      convertProgram(source, {}, given);
      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle loop with array pattern as left value', () => {
      const source = `
        for([foo, bar] of buzz) {
          foo()
          bar()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('_'), identifier('ref')],
          [
            withTrailingConversionComment(
              callExpression(identifier('ipairs'), [identifier('buzz')]),
              "ROBLOX CHECK: check if 'buzz' is an Array"
            ),
          ],
          [
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [identifier('foo'), identifier('bar')],
                [
                  tableUnpackCall(
                    identifier('ref'),
                    numericLiteral(1),
                    numericLiteral(2)
                  ),
                ]
              ),
            ]),
            nodeGroup([
              expressionStatement(callExpression(identifier('foo'), [])),
              expressionStatement(callExpression(identifier('bar'), [])),
            ]),
          ]
        ),
      ]);

      convertProgram(source, {}, given);
      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle loop with nested array pattern as left value', () => {
      const source = `
        for([foo, [bar]] of buzz) {
          foo()
          bar()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('_'), identifier('ref')],
          [
            withTrailingConversionComment(
              callExpression(identifier('ipairs'), [identifier('buzz')]),
              "ROBLOX CHECK: check if 'buzz' is an Array"
            ),
          ],
          [
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [identifier('foo')],
                [indexExpression(identifier('ref'), numericLiteral(1))]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [identifier('bar')],
                [
                  indexExpression(
                    tableUnpackCall(
                      identifier('ref'),
                      numericLiteral(2),
                      numericLiteral(2)
                    ),
                    numericLiteral(1)
                  ),
                ]
              ),
            ]),
            nodeGroup([
              expressionStatement(callExpression(identifier('foo'), [])),
              expressionStatement(callExpression(identifier('bar'), [])),
            ]),
          ]
        ),
      ]);

      convertProgram(source, {}, given);
      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    describe('unhandled cases', () => {
      it('should NOT YET handle loop with object pattern with nested array pattern as left value', () => {
        const source = dedent`
          for({foo, bar: [fizz]} of buzz) {
            foo()
            fizz()
          }
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          withTrailingConversionComment(
            unhandledStatement(),
            'ROBLOX TODO: Unhandled node for type: ForOfStatement where left side is not handled',
            'for({foo, bar: [fizz]} of buzz) {\n  foo()\n  fizz()\n}'
          ),
        ]);

        convertProgram(source, {}, given);
        expect(convertProgram(source, {}, given)).toEqual(expected);
      });

      it('should NOT YET handle loop with array pattern with nested object pattern as left value', () => {
        const source = dedent`
          for([foo, {bar}] of buzz) {
            foo()
            bar()
          }
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          withTrailingConversionComment(
            unhandledStatement(),
            'ROBLOX TODO: Unhandled node for type: ForOfStatement where left side is not handled',
            'for([foo, {bar}] of buzz) {\n  foo()\n  bar()\n}'
          ),
        ]);

        convertProgram(source, {}, given);
        expect(convertProgram(source, {}, given)).toEqual(expected);
      });
    });
  });
});

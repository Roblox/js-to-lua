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
import { handleProgram } from '../program.handler';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

describe('Program handler', () => {
  describe('For In statement Handler', () => {
    it(`should handle empty loop`, () => {
      const source = `
        for(const foo in bar) {}
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('foo')],
          [identifier('bar')],
          [nodeGroup([])]
        ),
      ]);

      handleProgram.handler(source, {}, given);
      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle loop with body`, () => {
      const source = `
        for(const foo in bar) {
          foo()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('foo')],
          [identifier('bar')],
          [
            nodeGroup([
              expressionStatement(callExpression(identifier('foo'), [])),
            ]),
          ]
        ),
      ]);

      handleProgram.handler(source, {}, given);
      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle loop with body on definitely an array`, () => {
      const source = `
        for(const foo in [bar]) {
          foo()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('foo')],
          [tableConstructor([tableNoKeyField(identifier('bar'))])],
          [
            nodeGroup([
              expressionStatement(callExpression(identifier('foo'), [])),
            ]),
          ]
        ),
      ]);

      handleProgram.handler(source, {}, given);
      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle nested loop`, () => {
      const source = `
        for(const foo in bar) {
          for(const fizz in buzz) {
            break
          }
          break
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('foo')],
          [identifier('bar')],
          [
            nodeGroup([
              forGenericStatement(
                [identifier('fizz')],
                [identifier('buzz')],
                [nodeGroup([breakStatement()])]
              ),
              breakStatement(),
            ]),
          ]
        ),
      ]);

      handleProgram.handler(source, {}, given);
      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle loop with identifier as left value', () => {
      const source = `
        for(foo in bar) {
          foo()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('ref')],
          [identifier('bar')],
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

      handleProgram.handler(source, {}, given);
      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle loop with object pattern as left value', () => {
      const source = `
        for({foo, bar} in buzz) {
          foo()
          bar()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('ref')],
          [identifier('buzz')],
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

      handleProgram.handler(source, {}, given);
      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle loop with nested object pattern as left value', () => {
      const source = `
        for({foo, bar: {fizz}} in buzz) {
          foo()
          fizz()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('ref')],
          [identifier('buzz')],
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

      handleProgram.handler(source, {}, given);
      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle loop with array pattern as left value', () => {
      const source = `
        for([foo, bar] in buzz) {
          foo()
          bar()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('ref')],
          [identifier('buzz')],
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

      handleProgram.handler(source, {}, given);
      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle loop with nested array pattern as left value', () => {
      const source = `
        for([foo, [bar]] in buzz) {
          foo()
          bar()
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        forGenericStatement(
          [identifier('ref')],
          [identifier('buzz')],
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

      handleProgram.handler(source, {}, given);
      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    describe('unhandled cases', () => {
      it('should NOT YET handle loop with object pattern with nested array pattern as left value', () => {
        const source = dedent`
          for({foo, bar: [fizz]} in buzz) {
            foo()
            fizz()
          }
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          withTrailingConversionComment(
            unhandledStatement(),
            'ROBLOX TODO: Unhandled node for type: ForInStatement where left side is not handled',
            'for({foo, bar: [fizz]} in buzz) {\n  foo()\n  fizz()\n}'
          ),
        ]);

        handleProgram.handler(source, {}, given);
        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should NOT YET handle loop with array pattern with nested object pattern as left value', () => {
        const source = dedent`
          for([foo, {bar}] in buzz) {
            foo()
            bar()
          }
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          withTrailingConversionComment(
            unhandledStatement(),
            'ROBLOX TODO: Unhandled node for type: ForInStatement where left side is not handled',
            'for([foo, {bar}] in buzz) {\n  foo()\n  bar()\n}'
          ),
        ]);

        handleProgram.handler(source, {}, given);
        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });
  });
});

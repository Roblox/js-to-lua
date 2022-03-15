import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  breakStatement,
  callExpression,
  expressionStatement,
  forGenericStatement,
  identifier,
  nodeGroup,
  program,
  tableConstructor,
  tableNoKeyField,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

describe('For Of statement Handler', () => {
  it(`should handle empty loop`, () => {
    const source = `
      for(const foo of bar) {}
    `;
    const given = getProgramNode(source);

    const expected = program([
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

    handleProgram.handler(source, {}, given);
    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle loop with body`, () => {
    const source = `
      for(const foo of bar) {
        foo()
      }
    `;
    const given = getProgramNode(source);

    const expected = program([
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

    handleProgram.handler(source, {}, given);
    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle loop with body on definitely an array`, () => {
    const source = `
      for(const foo of [bar]) {
        foo()
      }
    `;
    const given = getProgramNode(source);

    const expected = program([
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

    handleProgram.handler(source, {}, given);
    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
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

    const expected = program([
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

    handleProgram.handler(source, {}, given);
    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});

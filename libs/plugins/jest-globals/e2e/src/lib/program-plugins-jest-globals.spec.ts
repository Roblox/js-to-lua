import { parse, ParserOptions } from '@babel/parser';
import { Program } from '@babel/types';
import { convertProgram } from '@js-to-lua/convert';
import {
  prependLeadingComments,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  commentLine,
  expressionStatement,
  functionExpression,
  identifier,
  indexExpression,
  memberExpression,
  nodeGroup,
  program,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { jestPostProcessPlugin } from '@js-to-lua/plugins/jest-globals';

// TODO remove duplication
export const programWithUpstreamComment: typeof program = (
  ...args: Parameters<typeof program>
) =>
  prependLeadingComments(
    program(...args),
    commentLine(' ROBLOX NOTE: no upstream')
  );

export const getProgramNode = (
  code: string,
  additionalParserOptions?: Partial<ParserOptions>
): Program => {
  const file = parse(code, {
    sourceType: 'module',
    strictMode: true,
    plugins: [
      // enable jsx and flow syntax
      'jsx',
      'typescript',
    ],
    ...additionalParserOptions,
  });

  return file.program;
};

const convertProgramWithPlugin: typeof convertProgram = (
  source,
  config,
  node,
  options
) =>
  convertProgram(source, config, node, {
    ...options,
    plugins: [...(options?.plugins || []), jestPostProcessPlugin],
  });

describe('Program handler', () => {
  describe('Jest Globals Plugin', () => {
    describe('implicit globals', () => {
      const hookDeclaration = (hook: string) =>
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier(hook))],
          [
            variableDeclaratorValue(
              memberExpression(identifier('JestGlobals'), '.', identifier(hook))
            ),
          ]
        );
      const jestGlobalsDeclaration = variableDeclaration(
        [variableDeclaratorIdentifier(identifier('JestGlobals'))],
        [
          variableDeclaratorValue(
            callExpression(identifier('require'), [
              memberExpression(
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('Dev')
                ),
                '.',
                identifier('JestGlobals')
              ),
            ])
          ),
        ]
      );
      it('should handle program with it and describe', () => {
        const source = `
          describe('foo', () => {
            it('bar', () => {});
          });
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          packagesDeclaration,
          jestGlobalsDeclaration,
          hookDeclaration('describe'),
          hookDeclaration('it'),
          bodyWithDescribeAndIt,
        ]);

        const luaProgram = convertProgramWithPlugin(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle program with multiple hooks', () => {
        const source = `
          describe('foo', () => {
            beforeEach(() => {})
            afterEach(() => {})
            beforeAll(() => {})
            afterAll(() => {})
            it('bar', () => {});
          });
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          packagesDeclaration,
          jestGlobalsDeclaration,
          hookDeclaration('afterAll'),
          hookDeclaration('afterEach'),
          hookDeclaration('beforeAll'),
          hookDeclaration('beforeEach'),
          hookDeclaration('describe'),
          hookDeclaration('it'),
          bodyWithMultipleHooks,
        ]);

        const luaProgram = convertProgramWithPlugin(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle program with multiple hooks - duplicated plugin', () => {
        const source = `
          describe('foo', () => {
            beforeEach(() => {})
            afterEach(() => {})
            beforeAll(() => {})
            afterAll(() => {})
            it('bar', () => {});
          });
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          packagesDeclaration,
          jestGlobalsDeclaration,
          hookDeclaration('afterAll'),
          hookDeclaration('afterEach'),
          hookDeclaration('beforeAll'),
          hookDeclaration('beforeEach'),
          hookDeclaration('describe'),
          hookDeclaration('it'),
          bodyWithMultipleHooks,
        ]);

        const luaProgram = convertProgramWithPlugin(source, {}, given, {
          plugins: [jestPostProcessPlugin, jestPostProcessPlugin],
        });
        expect(luaProgram).toEqual(expected);
      });
    });

    describe('explicit globals', () => {
      const explicitHookDeclaration = (hook: string) =>
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier(hook))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('globalsModule'),
                '.',
                identifier(hook)
              )
            ),
          ]
        );
      const explicitGlobalsDeclaration = variableDeclaration(
        [variableDeclaratorIdentifier(identifier('globalsModule'))],
        [
          variableDeclaratorValue(
            callExpression(identifier('require'), [
              memberExpression(
                indexExpression(identifier('Packages'), stringLiteral('@jest')),
                '.',
                identifier('globals')
              ),
            ])
          ),
        ]
      );

      it('should handle program with it and describe', () => {
        const source = `
          import { describe, it } from '@jest/globals';

          describe('foo', () => {
            it('bar', () => {});
          });
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          packagesDeclaration,
          nodeGroup([
            explicitGlobalsDeclaration,
            explicitHookDeclaration('describe'),
            explicitHookDeclaration('it'),
          ]),
          bodyWithDescribeAndIt,
        ]);

        const luaProgram = convertProgramWithPlugin(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle program with multiple hooks', () => {
        const source = `
          import { describe, it, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';

          describe('foo', () => {
            beforeEach(() => {})
            afterEach(() => {})
            beforeAll(() => {})
            afterAll(() => {})
            it('bar', () => {});
          });
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          packagesDeclaration,
          nodeGroup([
            explicitGlobalsDeclaration,
            explicitHookDeclaration('describe'),
            explicitHookDeclaration('it'),
            explicitHookDeclaration('beforeEach'),
            explicitHookDeclaration('afterEach'),
            explicitHookDeclaration('beforeAll'),
            explicitHookDeclaration('afterAll'),
          ]),
          bodyWithMultipleHooks,
        ]);

        const luaProgram = convertProgramWithPlugin(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle program with multiple hooks - duplicated plugin', () => {
        const source = `
          import { describe, it, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';

          describe('foo', () => {
            beforeEach(() => {})
            afterEach(() => {})
            beforeAll(() => {})
            afterAll(() => {})
            it('bar', () => {});
          });
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          packagesDeclaration,
          nodeGroup([
            explicitGlobalsDeclaration,
            explicitHookDeclaration('describe'),
            explicitHookDeclaration('it'),
            explicitHookDeclaration('beforeEach'),
            explicitHookDeclaration('afterEach'),
            explicitHookDeclaration('beforeAll'),
            explicitHookDeclaration('afterAll'),
          ]),
          bodyWithMultipleHooks,
        ]);

        const luaProgram = convertProgramWithPlugin(source, {}, given, {
          plugins: [jestPostProcessPlugin, jestPostProcessPlugin],
        });
        expect(luaProgram).toEqual(expected);
      });
    });
  });
});

const packagesDeclaration = withTrailingConversionComment(
  variableDeclaration(
    [variableDeclaratorIdentifier(identifier('Packages'))],
    []
  ),
  'ROBLOX comment: must define Packages module'
);

const bodyWithDescribeAndIt = expressionStatement(
  callExpression(identifier('describe'), [
    stringLiteral('foo'),
    functionExpression(
      [],
      nodeGroup([
        nodeGroup([
          expressionStatement(
            callExpression(identifier('it'), [
              stringLiteral('bar'),
              functionExpression(),
            ])
          ),
        ]),
      ])
    ),
  ])
);
const bodyWithMultipleHooks = expressionStatement(
  callExpression(identifier('describe'), [
    stringLiteral('foo'),
    functionExpression(
      [],
      nodeGroup([
        nodeGroup([
          expressionStatement(
            callExpression(identifier('beforeEach'), [functionExpression()])
          ),
          expressionStatement(
            callExpression(identifier('afterEach'), [functionExpression()])
          ),
          expressionStatement(
            callExpression(identifier('beforeAll'), [functionExpression()])
          ),
          expressionStatement(
            callExpression(identifier('afterAll'), [functionExpression()])
          ),
          expressionStatement(
            callExpression(identifier('it'), [
              stringLiteral('bar'),
              functionExpression(),
            ])
          ),
        ]),
      ])
    ),
  ])
);

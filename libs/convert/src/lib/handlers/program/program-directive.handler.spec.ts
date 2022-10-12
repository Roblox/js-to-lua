import { withLeadingComments } from '@js-to-lua/lua-conversion-utils';
import {
  booleanLiteral,
  commentBlock,
  identifier,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { convertProgram } from '../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Directives', () => {
    it('should prepend directive comments', () => {
      const given = getProgramNode(dedent`
            /**
             * Directive Comment Block
             */
            
            'use strict';
              let foo = true
            `);
      const expected = programWithUpstreamComment([
        withLeadingComments(
          nodeGroup([]),
          commentBlock('*\n * Directive Comment Block\n ')
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [variableDeclaratorValue(booleanLiteral(true))]
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});

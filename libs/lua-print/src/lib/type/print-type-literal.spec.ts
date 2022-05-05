import {
  commentBlock,
  identifier,
  typeAnnotation,
  typeAny,
  typeLiteral,
  typePropertySignature,
} from '@js-to-lua/lua-types';
import { printNode, getPrintSections } from '../print-node';
import { _printComments } from '../printable-comments';
import { createPrintTypeLiteral } from './print-type-literal';

describe('Print type literal', () => {
  const printTsTypeLiteral = createPrintTypeLiteral(
    printNode,
    getPrintSections,
    _printComments
  );

  it('should print type literal with no members', () => {
    const given = typeLiteral([]);

    const expected = '{}';

    expect(printTsTypeLiteral(given)).toEqual(expected);
  });

  it('should print type literal with a member and no comments', () => {
    const given = typeLiteral([
      typePropertySignature(identifier('boo'), typeAnnotation(typeAny())),
    ]);

    const expected = '{ boo: any, }';

    expect(printTsTypeLiteral(given)).toEqual(expected);
  });

  it('should print type literal with a member and leading comment', () => {
    const given = typeLiteral([
      {
        ...typePropertySignature(identifier('boo'), typeAnnotation(typeAny())),
        leadingComments: [
          commentBlock(' Leading Comment ', 'SameLineLeadingComment'),
        ],
      },
    ]);

    const expected = `{ --[[ Leading Comment ]] boo: any, }`;

    expect(printTsTypeLiteral(given)).toEqual(expected);
  });

  it('should print type literal with a member and trailing identifier comment', () => {
    const given = typeLiteral([
      typePropertySignature(
        {
          ...identifier('boo'),
          trailingComments: [
            commentBlock(' Trailing Comment ', 'SameLineTrailingComment'),
          ],
        },
        typeAnnotation(typeAny())
      ),
    ]);

    const expected = `{ boo --[[ Trailing Comment ]]: any, }`;

    expect(printTsTypeLiteral(given)).toEqual(expected);
  });

  it('should print type literal with a member and leading type annotation comment', () => {
    const given = typeLiteral([
      typePropertySignature(
        identifier('boo'),
        typeAnnotation({
          ...typeAny(),
          leadingComments: [
            commentBlock(' Leading Comment ', 'SameLineLeadingComment'),
          ],
        })
      ),
    ]);

    const expected = `{ boo: --[[ Leading Comment ]] any, }`;

    expect(printTsTypeLiteral(given)).toEqual(expected);
  });

  it('should print type literal with a member and trailing comment', () => {
    const given = typeLiteral([
      {
        ...typePropertySignature(identifier('boo'), typeAnnotation(typeAny())),
        trailingComments: [
          commentBlock(' Trailing Comment ', 'SameLineTrailingComment'),
        ],
      },
    ]);

    const expected = `{ boo: any, --[[ Trailing Comment ]] }`;

    expect(printTsTypeLiteral(given)).toEqual(expected);
  });
});

import {
  anyTypeAnnotation,
  booleanTypeAnnotation,
  FlowType,
  functionTypeAnnotation,
  genericTypeAnnotation,
  identifier as babelIdentifier,
  Identifier,
  isBooleanTypeAnnotation,
  isNumberTypeAnnotation,
  isObjectTypeAnnotation,
  isStringTypeAnnotation,
  numberTypeAnnotation,
  objectTypeAnnotation as babelObjectTypeAnnotation,
  objectTypeCallProperty,
  objectTypeIndexer,
  objectTypeInternalSlot,
  objectTypeProperty,
  objectTypeSpreadProperty,
  stringLiteral as babelStringLiteral,
  stringTypeAnnotation,
} from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import {
  withInnerConversionComment,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaIdentifier,
  LuaType,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeIndexSignature,
  typeIntersection,
  typeLiteral,
  typeNumber,
  typePropertySignature,
  typeString,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  withLocation,
  withLocationFromSource,
} from '@js-to-lua/lua-types/test-utils';
import { dedent } from '@js-to-lua/shared-utils';
import { createFlowObjectTypeAnnotationHandler } from './object-type-annotation.handler';

const { withBabelComments, withLuaComments, withLuaInnerComments } = testUtils;

describe('Flow - ObjectTypeAnnotation handler', () => {
  const { handler } = createFlowObjectTypeAnnotationHandler(
    createHandlerFunction<LuaIdentifier, Identifier>((source, config, node) =>
      identifier(node.name)
    ),
    createHandlerFunction<LuaType, FlowType>((source, config, node) => {
      return isStringTypeAnnotation(node)
        ? typeString()
        : isNumberTypeAnnotation(node)
        ? typeNumber()
        : isBooleanTypeAnnotation(node)
        ? typeBoolean()
        : isObjectTypeAnnotation(node)
        ? handler(source, config, node)
        : mockNodeWithValue(node);
    })
  );

  const source = '';

  describe.each([true, false])('- exact: %s', (exact) => {
    const exactObjectTypeAnnotation = (
      ...params: Parameters<typeof babelObjectTypeAnnotation>
    ): ReturnType<typeof babelObjectTypeAnnotation> => ({
      ...babelObjectTypeAnnotation(...params),
      exact,
    });

    it('should handle empty ObjectTypeAnnotation', () => {
      const given = exactObjectTypeAnnotation([]);
      const expected = typeLiteral([]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with props with simple types', () => {
      const given = exactObjectTypeAnnotation([
        objectTypeProperty(babelIdentifier('foo'), stringTypeAnnotation()),
        objectTypeProperty(babelIdentifier('bar'), numberTypeAnnotation()),
        objectTypeProperty(babelIdentifier('baz'), booleanTypeAnnotation()),
      ]);
      const expected = typeLiteral([
        typePropertySignature(identifier('foo'), typeAnnotation(typeString())),
        typePropertySignature(identifier('bar'), typeAnnotation(typeNumber())),
        typePropertySignature(identifier('baz'), typeAnnotation(typeBoolean())),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with props with simple types and string literals as keys', () => {
      const given = exactObjectTypeAnnotation([
        objectTypeProperty(babelStringLiteral('foo'), stringTypeAnnotation()),
        objectTypeProperty(babelStringLiteral('bar'), numberTypeAnnotation()),
        objectTypeProperty(babelStringLiteral('baz'), booleanTypeAnnotation()),
      ]);
      const expected = typeLiteral([
        typePropertySignature(identifier('foo'), typeAnnotation(typeString())),
        typePropertySignature(identifier('bar'), typeAnnotation(typeNumber())),
        typePropertySignature(identifier('baz'), typeAnnotation(typeBoolean())),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with nested ObjectTypeAnnotation', () => {
      const given = exactObjectTypeAnnotation([
        objectTypeProperty(
          babelIdentifier('nested'),
          exactObjectTypeAnnotation([
            objectTypeProperty(babelIdentifier('foo'), stringTypeAnnotation()),
            objectTypeProperty(babelIdentifier('bar'), numberTypeAnnotation()),
            objectTypeProperty(babelIdentifier('baz'), booleanTypeAnnotation()),
          ])
        ),
      ]);
      const expected = typeLiteral([
        typePropertySignature(
          identifier('nested'),
          typeAnnotation(
            typeLiteral([
              typePropertySignature(
                identifier('foo'),
                typeAnnotation(typeString())
              ),
              typePropertySignature(
                identifier('bar'),
                typeAnnotation(typeNumber())
              ),
              typePropertySignature(
                identifier('baz'),
                typeAnnotation(typeBoolean())
              ),
            ])
          )
        ),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeSpreadProperty', () => {
      const given = exactObjectTypeAnnotation([
        objectTypeSpreadProperty(
          genericTypeAnnotation(babelIdentifier('AnotherType'))
        ),
      ]);
      const expected = mockNodeWithValue(
        genericTypeAnnotation(babelIdentifier('AnotherType'))
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeSpreadProperty and additional props', () => {
      const given = exactObjectTypeAnnotation([
        objectTypeSpreadProperty(
          genericTypeAnnotation(babelIdentifier('AnotherType'))
        ),
        objectTypeProperty(babelIdentifier('foo'), stringTypeAnnotation()),
        objectTypeProperty(babelIdentifier('bar'), numberTypeAnnotation()),
        objectTypeProperty(babelIdentifier('baz'), booleanTypeAnnotation()),
      ]);
      const expected = typeIntersection([
        mockNodeWithValue(
          genericTypeAnnotation(babelIdentifier('AnotherType'))
        ),
        typeLiteral([
          typePropertySignature(
            identifier('foo'),
            typeAnnotation(typeString())
          ),
          typePropertySignature(
            identifier('bar'),
            typeAnnotation(typeNumber())
          ),
          typePropertySignature(
            identifier('baz'),
            typeAnnotation(typeBoolean())
          ),
        ]),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it.skip('should handle ObjectTypeAnnotation with mutliple ObjectTypeSpreadProperty and additional props', () => {
      const given = exactObjectTypeAnnotation([
        objectTypeSpreadProperty(
          genericTypeAnnotation(babelIdentifier('SomeType'))
        ),
        objectTypeProperty(babelIdentifier('foo'), stringTypeAnnotation()),
        objectTypeProperty(babelIdentifier('bar'), numberTypeAnnotation()),
        objectTypeSpreadProperty(
          genericTypeAnnotation(babelIdentifier('AnotherType'))
        ),
        objectTypeProperty(babelIdentifier('baz'), booleanTypeAnnotation()),
        objectTypeSpreadProperty(
          genericTypeAnnotation(babelIdentifier('YetAnotherType'))
        ),
      ]);
      const expected = typeIntersection([
        mockNodeWithValue(genericTypeAnnotation(babelIdentifier('SomeType'))),
        typeLiteral([
          typePropertySignature(
            identifier('foo'),
            typeAnnotation(typeString())
          ),
          typePropertySignature(
            identifier('bar'),
            typeAnnotation(typeNumber())
          ),
        ]),
        mockNodeWithValue(
          genericTypeAnnotation(babelIdentifier('AnotherType'))
        ),
        typeLiteral([
          typePropertySignature(
            identifier('baz'),
            typeAnnotation(typeBoolean())
          ),
        ]),
        mockNodeWithValue(
          genericTypeAnnotation(babelIdentifier('YetAnotherType'))
        ),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeIndexer', () => {
      const given = exactObjectTypeAnnotation(
        [],
        [
          objectTypeIndexer(
            null,
            stringTypeAnnotation(),
            numberTypeAnnotation()
          ),
        ]
      );
      const expected = typeLiteral([
        typeIndexSignature(typeString(), typeAnnotation(typeNumber())),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with multiple ObjectTypeIndexers', () => {
      const given = exactObjectTypeAnnotation(
        [],
        [
          objectTypeIndexer(
            null,
            stringTypeAnnotation(),
            numberTypeAnnotation()
          ),
          objectTypeIndexer(
            null,
            numberTypeAnnotation(),
            booleanTypeAnnotation()
          ),
        ]
      );
      const expected = withTrailingConversionComment(
        typeAny(),
        `ROBLOX TODO: Unhandled node for type: ObjectTypeAnnotation when multiple indexers are present`
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeCallProperty', () => {
      const source = `type Foo = { (): any }`;
      const given = exactObjectTypeAnnotation(
        [],
        [],
        [
          withLocation({ start: 13, end: 20 })(
            objectTypeCallProperty(
              functionTypeAnnotation(null, [], null, anyTypeAnnotation())
            )
          ),
        ]
      );
      const expected = withInnerConversionComment(
        typeLiteral([]),
        'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
        '(): any'
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with multiple ObjectTypeCallProperties', () => {
      const source = `type Foo = { (): any, (string): string }`;
      const given = exactObjectTypeAnnotation(
        [],
        [],
        [
          withLocation({ start: 13, end: 20 })(
            objectTypeCallProperty(
              functionTypeAnnotation(null, [], null, anyTypeAnnotation())
            )
          ),
          withLocation({ start: 22, end: 38 })(
            objectTypeCallProperty(
              functionTypeAnnotation(null, [], null, anyTypeAnnotation())
            )
          ),
        ]
      );
      const expected = withInnerConversionComment(
        typeLiteral([]),
        'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
        '(): any',
        '(string): string'
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeInternalSlot', () => {
      const source = `type Foo = { [[Slot]]: any }`;
      const given = exactObjectTypeAnnotation(
        [],
        [],
        [],
        [
          withLocation({
            start: 13,
            end: 26,
          })(
            objectTypeInternalSlot(
              babelIdentifier('Slot'),
              anyTypeAnnotation(),
              false,
              false,
              false
            )
          ),
        ]
      );
      const expected = withInnerConversionComment(
        typeLiteral([]),
        'ROBLOX TODO: Unhandled node for type: ObjectTypeInternalSlot',
        '[[Slot]]: any'
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with all possible properties', () => {
      const source = dedent`
      type Foo = {
        prop: string,
        ...Foo,
        [string]: boolean,
        (): any,
        (string): string,
        [[Slot]]: any,
      }
    `;
      const withSourceLocation = withLocationFromSource(source);

      const given = exactObjectTypeAnnotation(
        [
          objectTypeProperty(babelIdentifier('prop'), stringTypeAnnotation()),
          objectTypeSpreadProperty(
            genericTypeAnnotation(babelIdentifier('Foo'))
          ),
        ],
        [
          objectTypeIndexer(
            null,
            stringTypeAnnotation(),
            booleanTypeAnnotation()
          ),
        ],
        [
          withSourceLocation('(): any')(
            objectTypeCallProperty(
              functionTypeAnnotation(null, [], null, anyTypeAnnotation())
            )
          ),
          withSourceLocation('(string): string')(
            objectTypeCallProperty(
              functionTypeAnnotation(null, [], null, anyTypeAnnotation())
            )
          ),
        ],
        [
          withSourceLocation('[[Slot]]: any')(
            objectTypeInternalSlot(
              babelIdentifier('Slot'),
              anyTypeAnnotation(),
              false,
              false,
              false
            )
          ),
        ]
      );
      const expected = typeIntersection([
        mockNodeWithValue(genericTypeAnnotation(babelIdentifier('Foo'))),
        withInnerConversionComment(
          typeLiteral([
            typePropertySignature(
              identifier('prop'),
              typeAnnotation(typeString())
            ),
            typeIndexSignature(typeString(), typeAnnotation(typeBoolean())),
          ]),
          'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
          '(): any',
          '(string): string',
          'ROBLOX TODO: Unhandled node for type: ObjectTypeInternalSlot',
          '[[Slot]]: any'
        ),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });
  });

  describe('- inexact', () => {
    const inexactObjectTypeAnnotation = (
      ...params: Parameters<typeof babelObjectTypeAnnotation>
    ): ReturnType<typeof babelObjectTypeAnnotation> => ({
      ...babelObjectTypeAnnotation(...params),
      inexact: true,
    });

    it('should handle empty ObjectTypeAnnotation', () => {
      const given = inexactObjectTypeAnnotation([]);
      const expected = withTrailingConversionComment(
        typeLiteral([]),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with props with simple types', () => {
      const given = inexactObjectTypeAnnotation([
        objectTypeProperty(babelIdentifier('foo'), stringTypeAnnotation()),
        objectTypeProperty(babelIdentifier('bar'), numberTypeAnnotation()),
        objectTypeProperty(babelIdentifier('baz'), booleanTypeAnnotation()),
      ]);
      const expected = withTrailingConversionComment(
        typeLiteral([
          typePropertySignature(
            identifier('foo'),
            typeAnnotation(typeString())
          ),
          typePropertySignature(
            identifier('bar'),
            typeAnnotation(typeNumber())
          ),
          typePropertySignature(
            identifier('baz'),
            typeAnnotation(typeBoolean())
          ),
        ]),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with props with simple types and string literals as keys', () => {
      const given = inexactObjectTypeAnnotation([
        objectTypeProperty(babelStringLiteral('foo'), stringTypeAnnotation()),
        objectTypeProperty(babelStringLiteral('bar'), numberTypeAnnotation()),
        objectTypeProperty(babelStringLiteral('baz'), booleanTypeAnnotation()),
      ]);
      const expected = withTrailingConversionComment(
        typeLiteral([
          typePropertySignature(
            identifier('foo'),
            typeAnnotation(typeString())
          ),
          typePropertySignature(
            identifier('bar'),
            typeAnnotation(typeNumber())
          ),
          typePropertySignature(
            identifier('baz'),
            typeAnnotation(typeBoolean())
          ),
        ]),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with nested ObjectTypeAnnotation', () => {
      const given = inexactObjectTypeAnnotation([
        objectTypeProperty(
          babelIdentifier('nested'),
          inexactObjectTypeAnnotation([
            objectTypeProperty(babelIdentifier('foo'), stringTypeAnnotation()),
            objectTypeProperty(babelIdentifier('bar'), numberTypeAnnotation()),
            objectTypeProperty(babelIdentifier('baz'), booleanTypeAnnotation()),
          ])
        ),
      ]);
      const expected = withTrailingConversionComment(
        typeLiteral([
          typePropertySignature(
            identifier('nested'),
            typeAnnotation(
              withTrailingConversionComment(
                typeLiteral([
                  typePropertySignature(
                    identifier('foo'),
                    typeAnnotation(typeString())
                  ),
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeNumber())
                  ),
                  typePropertySignature(
                    identifier('baz'),
                    typeAnnotation(typeBoolean())
                  ),
                ]),
                "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
              )
            )
          ),
        ]),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeSpreadProperty', () => {
      const given = inexactObjectTypeAnnotation([
        objectTypeSpreadProperty(
          genericTypeAnnotation(babelIdentifier('AnotherType'))
        ),
      ]);
      const expected = withTrailingConversionComment(
        mockNodeWithValue(
          genericTypeAnnotation(babelIdentifier('AnotherType'))
        ),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeSpreadProperty and additional props', () => {
      const given = inexactObjectTypeAnnotation([
        objectTypeSpreadProperty(
          genericTypeAnnotation(babelIdentifier('AnotherType'))
        ),
        objectTypeProperty(babelIdentifier('foo'), stringTypeAnnotation()),
        objectTypeProperty(babelIdentifier('bar'), numberTypeAnnotation()),
        objectTypeProperty(babelIdentifier('baz'), booleanTypeAnnotation()),
      ]);
      const expected = withTrailingConversionComment(
        typeIntersection([
          mockNodeWithValue(
            genericTypeAnnotation(babelIdentifier('AnotherType'))
          ),
          typeLiteral([
            typePropertySignature(
              identifier('foo'),
              typeAnnotation(typeString())
            ),
            typePropertySignature(
              identifier('bar'),
              typeAnnotation(typeNumber())
            ),
            typePropertySignature(
              identifier('baz'),
              typeAnnotation(typeBoolean())
            ),
          ]),
        ]),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeIndexer', () => {
      const given = inexactObjectTypeAnnotation(
        [],
        [
          objectTypeIndexer(
            null,
            stringTypeAnnotation(),
            numberTypeAnnotation()
          ),
        ]
      );
      const expected = withTrailingConversionComment(
        typeLiteral([
          typeIndexSignature(typeString(), typeAnnotation(typeNumber())),
        ]),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with multiple ObjectTypeIndexers', () => {
      const given = inexactObjectTypeAnnotation(
        [],
        [
          objectTypeIndexer(
            null,
            stringTypeAnnotation(),
            numberTypeAnnotation()
          ),
          objectTypeIndexer(
            null,
            numberTypeAnnotation(),
            booleanTypeAnnotation()
          ),
        ]
      );
      const expected = withTrailingConversionComment(
        typeAny(),
        `ROBLOX TODO: Unhandled node for type: ObjectTypeAnnotation when multiple indexers are present`
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeCallProperty', () => {
      const source = `type Foo = { (): any }`;
      const given = inexactObjectTypeAnnotation(
        [],
        [],
        [
          withLocation({ start: 13, end: 20 })(
            objectTypeCallProperty(
              functionTypeAnnotation(null, [], null, anyTypeAnnotation())
            )
          ),
        ]
      );
      const expected = withTrailingConversionComment(
        withInnerConversionComment(
          typeLiteral([]),
          'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
          '(): any'
        ),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with multiple ObjectTypeCallProperties', () => {
      const source = `type Foo = { (): any, (string): string }`;
      const given = inexactObjectTypeAnnotation(
        [],
        [],
        [
          withLocation({ start: 13, end: 20 })(
            objectTypeCallProperty(
              functionTypeAnnotation(null, [], null, anyTypeAnnotation())
            )
          ),
          withLocation({ start: 22, end: 38 })(
            objectTypeCallProperty(
              functionTypeAnnotation(null, [], null, anyTypeAnnotation())
            )
          ),
        ]
      );
      const expected = withTrailingConversionComment(
        withInnerConversionComment(
          typeLiteral([]),
          'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
          '(): any',
          '(string): string'
        ),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeInternalSlot', () => {
      const source = `type Foo = { [[Slot]]: any }`;
      const given = inexactObjectTypeAnnotation(
        [],
        [],
        [],
        [
          withLocation({
            start: 13,
            end: 26,
          })(
            objectTypeInternalSlot(
              babelIdentifier('Slot'),
              anyTypeAnnotation(),
              false,
              false,
              false
            )
          ),
        ]
      );
      const expected = withTrailingConversionComment(
        withInnerConversionComment(
          typeLiteral([]),
          'ROBLOX TODO: Unhandled node for type: ObjectTypeInternalSlot',
          '[[Slot]]: any'
        ),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with all possible properties', () => {
      const source = dedent`
      type Foo = {
        prop: string,
        ...Foo,
        [string]: boolean,
        (): any,
        (string): string,
        [[Slot]]: any,
      }
    `;
      const withSourceLocation = withLocationFromSource(source);

      const given = inexactObjectTypeAnnotation(
        [
          objectTypeProperty(babelIdentifier('prop'), stringTypeAnnotation()),
          objectTypeSpreadProperty(
            genericTypeAnnotation(babelIdentifier('Foo'))
          ),
        ],
        [
          objectTypeIndexer(
            null,
            stringTypeAnnotation(),
            booleanTypeAnnotation()
          ),
        ],
        [
          withSourceLocation('(): any')(
            objectTypeCallProperty(
              functionTypeAnnotation(null, [], null, anyTypeAnnotation())
            )
          ),
          withSourceLocation('(string): string')(
            objectTypeCallProperty(
              functionTypeAnnotation(null, [], null, anyTypeAnnotation())
            )
          ),
        ],
        [
          withSourceLocation('[[Slot]]: any')(
            objectTypeInternalSlot(
              babelIdentifier('Slot'),
              anyTypeAnnotation(),
              false,
              false,
              false
            )
          ),
        ]
      );
      const expected = withTrailingConversionComment(
        typeIntersection([
          mockNodeWithValue(genericTypeAnnotation(babelIdentifier('Foo'))),
          withInnerConversionComment(
            typeLiteral([
              typePropertySignature(
                identifier('prop'),
                typeAnnotation(typeString())
              ),
              typeIndexSignature(typeString(), typeAnnotation(typeBoolean())),
            ]),
            'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
            '(): any',
            '(string): string',
            'ROBLOX TODO: Unhandled node for type: ObjectTypeInternalSlot',
            '[[Slot]]: any'
          ),
        ]),
        "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });
  });

  describe('comments', () => {
    it('should preserve comments on empty ObjectTypeAnnotation', () => {
      const given = withBabelComments(babelObjectTypeAnnotation([]));
      const expected = withLuaComments(typeLiteral([]));

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should preserve comments on ObjectTypeAnnotation props with simple types', () => {
      const given = babelObjectTypeAnnotation([
        withBabelComments(
          objectTypeProperty(
            withBabelComments(babelIdentifier('foo'), 'foo id comment'),
            withBabelComments(
              stringTypeAnnotation(),
              'foo type annotation comment'
            )
          ),
          'foo comment'
        ),
        withBabelComments(
          objectTypeProperty(
            withBabelComments(babelIdentifier('bar'), 'bar id comment'),
            withBabelComments(
              numberTypeAnnotation(),
              'bar type annotation comment'
            )
          ),
          'bar comment'
        ),
        withBabelComments(
          objectTypeProperty(
            withBabelComments(babelIdentifier('baz'), 'baz id comment'),
            withBabelComments(
              booleanTypeAnnotation(),
              'baz type annotation comment'
            )
          ),
          'baz comment'
        ),
      ]);
      const expected = typeLiteral([
        withLuaComments(
          typePropertySignature(
            withLuaComments(identifier('foo'), 'foo id comment'),
            typeAnnotation(
              withLuaComments(typeString(), 'foo type annotation comment')
            )
          ),
          'foo comment'
        ),
        withLuaComments(
          typePropertySignature(
            withLuaComments(identifier('bar'), 'bar id comment'),
            typeAnnotation(
              withLuaComments(typeNumber(), 'bar type annotation comment')
            )
          ),
          'bar comment'
        ),
        withLuaComments(
          typePropertySignature(
            withLuaComments(identifier('baz'), 'baz id comment'),
            typeAnnotation(
              withLuaComments(typeBoolean(), 'baz type annotation comment')
            )
          ),
          'baz comment'
        ),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with props with simple types and string literals as keys', () => {
      const given = babelObjectTypeAnnotation([
        withBabelComments(
          objectTypeProperty(
            withBabelComments(babelStringLiteral('foo'), 'foo id comment'),
            withBabelComments(
              stringTypeAnnotation(),
              'foo type annotation comment'
            )
          ),
          'foo comment'
        ),
        withBabelComments(
          objectTypeProperty(
            withBabelComments(babelStringLiteral('bar'), 'bar id comment'),
            withBabelComments(
              numberTypeAnnotation(),
              'bar type annotation comment'
            )
          ),
          'bar comment'
        ),
        withBabelComments(
          objectTypeProperty(
            withBabelComments(babelStringLiteral('baz'), 'baz id comment'),
            withBabelComments(
              booleanTypeAnnotation(),
              'baz type annotation comment'
            )
          ),
          'baz comment'
        ),
      ]);
      const expected = typeLiteral([
        withLuaComments(
          typePropertySignature(
            withLuaComments(identifier('foo'), 'foo id comment'),
            typeAnnotation(
              withLuaComments(typeString(), 'foo type annotation comment')
            )
          ),
          'foo comment'
        ),
        withLuaComments(
          typePropertySignature(
            withLuaComments(identifier('bar'), 'bar id comment'),
            typeAnnotation(
              withLuaComments(typeNumber(), 'bar type annotation comment')
            )
          ),
          'bar comment'
        ),
        withLuaComments(
          typePropertySignature(
            withLuaComments(identifier('baz'), 'baz id comment'),
            typeAnnotation(
              withLuaComments(typeBoolean(), 'baz type annotation comment')
            )
          ),
          'baz comment'
        ),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeSpreadProperty', () => {
      const given = babelObjectTypeAnnotation([
        withBabelComments(
          objectTypeSpreadProperty(
            withBabelComments(
              genericTypeAnnotation(babelIdentifier('AnotherType')),
              'generic type annotation comment'
            )
          ),
          'spread prop comment'
        ),
      ]);
      const expected = withLuaComments(
        withLuaComments(
          mockNodeWithValue(
            withBabelComments(
              genericTypeAnnotation(babelIdentifier('AnotherType')),
              'generic type annotation comment'
            )
          ),
          'generic type annotation comment'
        ),
        'spread prop comment'
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeSpreadProperty and additional props', () => {
      const given = babelObjectTypeAnnotation([
        withBabelComments(
          objectTypeSpreadProperty(
            withBabelComments(
              genericTypeAnnotation(babelIdentifier('AnotherType')),
              'generic type annotation comment'
            )
          ),
          'spread prop comment'
        ),
        withBabelComments(
          objectTypeProperty(
            withBabelComments(babelStringLiteral('foo'), 'foo id comment'),
            withBabelComments(
              stringTypeAnnotation(),
              'foo type annotation comment'
            )
          ),
          'foo comment'
        ),
        withBabelComments(
          objectTypeProperty(
            withBabelComments(babelStringLiteral('bar'), 'bar id comment'),
            withBabelComments(
              numberTypeAnnotation(),
              'bar type annotation comment'
            )
          ),
          'bar comment'
        ),
        withBabelComments(
          objectTypeProperty(
            withBabelComments(babelStringLiteral('baz'), 'baz id comment'),
            withBabelComments(
              booleanTypeAnnotation(),
              'baz type annotation comment'
            )
          ),
          'baz comment'
        ),
      ]);
      const expected = typeIntersection([
        withLuaComments(
          withLuaComments(
            mockNodeWithValue(
              withBabelComments(
                genericTypeAnnotation(babelIdentifier('AnotherType')),
                'generic type annotation comment'
              )
            ),
            'generic type annotation comment'
          ),
          'spread prop comment'
        ),
        typeLiteral([
          withLuaComments(
            typePropertySignature(
              withLuaComments(identifier('foo'), 'foo id comment'),
              typeAnnotation(
                withLuaComments(typeString(), 'foo type annotation comment')
              )
            ),
            'foo comment'
          ),
          withLuaComments(
            typePropertySignature(
              withLuaComments(identifier('bar'), 'bar id comment'),
              typeAnnotation(
                withLuaComments(typeNumber(), 'bar type annotation comment')
              )
            ),
            'bar comment'
          ),
          withLuaComments(
            typePropertySignature(
              withLuaComments(identifier('baz'), 'baz id comment'),
              typeAnnotation(
                withLuaComments(typeBoolean(), 'baz type annotation comment')
              )
            ),
            'baz comment'
          ),
        ]),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeIndexer', () => {
      const given = babelObjectTypeAnnotation(
        [],
        [
          withBabelComments(
            objectTypeIndexer(
              null,
              withBabelComments(
                stringTypeAnnotation(),
                'string type annotation comment'
              ),
              withBabelComments(
                numberTypeAnnotation(),
                'number type annotation comment'
              )
            ),
            'object type indexer comment'
          ),
        ]
      );
      const expected = typeLiteral([
        withLuaComments(
          typeIndexSignature(
            withLuaComments(typeString(), 'string type annotation comment'),
            typeAnnotation(
              withLuaComments(typeNumber(), 'number type annotation comment')
            )
          ),
          'object type indexer comment'
        ),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });

    // TODO: handle comments from unhandled properties
    it.skip('should handle ObjectTypeAnnotation with ObjectTypeCallProperty', () => {
      const source = `type Foo = { (): any }`;
      const given = babelObjectTypeAnnotation(
        [],
        [],
        [
          withBabelComments(
            withLocation({ start: 13, end: 20 })(
              objectTypeCallProperty(
                functionTypeAnnotation(null, [], null, anyTypeAnnotation())
              )
            ),
            'object type call property comment'
          ),
        ]
      );
      const expected = withLuaInnerComments(
        withInnerConversionComment(
          typeLiteral([]),
          'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
          '(): any'
        ),
        'object type call property comment'
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    // TODO: handle comments from unhandled properties
    it.skip('should handle ObjectTypeAnnotation with multiple ObjectTypeCallProperties', () => {
      const source = `type Foo = { (): any, (string): string }`;
      const given = babelObjectTypeAnnotation(
        [],
        [],
        [
          withBabelComments(
            withLocation({ start: 13, end: 20 })(
              objectTypeCallProperty(
                functionTypeAnnotation(null, [], null, anyTypeAnnotation())
              )
            ),
            'object type call property comment first'
          ),
          withBabelComments(
            withLocation({ start: 22, end: 38 })(
              objectTypeCallProperty(
                functionTypeAnnotation(null, [], null, anyTypeAnnotation())
              )
            ),
            'object type call property comment second'
          ),
        ]
      );
      const expected = withLuaInnerComments(
        withLuaInnerComments(
          withInnerConversionComment(
            typeLiteral([]),
            'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
            '(): any',
            '(string): string'
          ),
          'object type call property comment first'
        ),
        'object type call property comment second'
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });

    // TODO: handle comments from unhandled properties
    it.skip('should handle ObjectTypeAnnotation with ObjectTypeInternalSlot', () => {
      const source = `type Foo = { [[Slot]]: any }`;
      const given = babelObjectTypeAnnotation(
        [],
        [],
        [],
        [
          withBabelComments(
            withLocation({
              start: 13,
              end: 26,
            })(
              objectTypeInternalSlot(
                babelIdentifier('Slot'),
                anyTypeAnnotation(),
                false,
                false,
                false
              )
            ),
            'object type internal slot comment'
          ),
        ]
      );
      const expected = withLuaInnerComments(
        withInnerConversionComment(
          typeLiteral([]),
          'ROBLOX TODO: Unhandled node for type: ObjectTypeInternalSlot',
          '[[Slot]]: any'
        ),
        'object type internal slot comment'
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });
  });
});

import * as Babel from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import {
  withInnerConversionComment,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaIdentifier,
  LuaType,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeIndexSignature,
  typeIntersection,
  typeLiteral,
  typeNumber,
  typeParameterDeclaration,
  typePropertySignature,
  typeReference,
  typeString,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  withLocation,
  withLocationFromSource,
} from '@js-to-lua/lua-types/test-utils';
import { dedent } from '@js-to-lua/shared-utils';
import { createFlowObjectTypeAnnotationHandler } from '../type/flow/object-type-annotation.handler';
import { createFlowInterfaceHandler } from './flow-interface-declaration.handler';

const { withBabelComments, withLuaComments } = testUtils;

describe('Flow - InterfaceDeclaration handler', () => {
  const handleIdentifierStrict = createHandlerFunction<
    LuaIdentifier,
    Babel.Identifier
  >((source, config, node) => identifier(node.name));
  const handleType = createHandlerFunction<LuaType, Babel.FlowType>(
    (source, config, node) => {
      return Babel.isStringTypeAnnotation(node)
        ? typeString()
        : Babel.isNumberTypeAnnotation(node)
        ? typeNumber()
        : Babel.isBooleanTypeAnnotation(node)
        ? typeBoolean()
        : Babel.isObjectTypeAnnotation(node)
        ? handleObjectTypeAnnotation(source, config, node)
        : mockNodeWithValue(node);
    }
  );
  const { handler: handleObjectTypeAnnotation } =
    createFlowObjectTypeAnnotationHandler(handleIdentifierStrict, handleType);

  const { handler } = createFlowInterfaceHandler(
    handleIdentifierStrict,
    handleType
  );

  const source = '';

  describe.each([true, false])('- exact: %s', (exact) => {
    const exactObjectTypeAnnotation = (
      ...params: Parameters<typeof Babel.objectTypeAnnotation>
    ): ReturnType<typeof Babel.objectTypeAnnotation> => ({
      ...Babel.objectTypeAnnotation(...params),
      exact,
    });

    it('should handle empty InterfaceDeclaration', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation([])
      );
      exactObjectTypeAnnotation([]);
      const expected = typeAliasDeclaration(identifier('Foo'), typeLiteral([]));

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with props with simple types', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation([
          Babel.objectTypeProperty(
            Babel.identifier('foo'),
            Babel.stringTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.identifier('bar'),
            Babel.numberTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.identifier('baz'),
            Babel.booleanTypeAnnotation()
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
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
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with props with simple types and string literals as keys', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation([
          Babel.objectTypeProperty(
            Babel.stringLiteral('foo'),
            Babel.stringTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.stringLiteral('bar'),
            Babel.numberTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.stringLiteral('baz'),
            Babel.booleanTypeAnnotation()
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
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
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with nested ObjectTypeAnnotation', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation([
          Babel.objectTypeProperty(
            Babel.identifier('nested'),
            exactObjectTypeAnnotation([
              Babel.objectTypeProperty(
                Babel.identifier('foo'),
                Babel.stringTypeAnnotation()
              ),
              Babel.objectTypeProperty(
                Babel.identifier('bar'),
                Babel.numberTypeAnnotation()
              ),
              Babel.objectTypeProperty(
                Babel.identifier('baz'),
                Babel.booleanTypeAnnotation()
              ),
            ])
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        typeLiteral([
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
        ])
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with ObjectTypeSpreadProperty', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation([
          Babel.objectTypeSpreadProperty(
            Babel.genericTypeAnnotation(Babel.identifier('AnotherType'))
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        mockNodeWithValue(
          Babel.genericTypeAnnotation(Babel.identifier('AnotherType'))
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with ObjectTypeSpreadProperty and additional props', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation([
          Babel.objectTypeSpreadProperty(
            Babel.genericTypeAnnotation(Babel.identifier('AnotherType'))
          ),
          Babel.objectTypeProperty(
            Babel.identifier('foo'),
            Babel.stringTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.identifier('bar'),
            Babel.numberTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.identifier('baz'),
            Babel.booleanTypeAnnotation()
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        typeIntersection([
          mockNodeWithValue(
            Babel.genericTypeAnnotation(Babel.identifier('AnotherType'))
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
        ])
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it.skip('should handle InterfaceDeclaration with multiple ObjectTypeSpreadProperty and additional props', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation([
          Babel.objectTypeSpreadProperty(
            Babel.genericTypeAnnotation(Babel.identifier('SomeType'))
          ),
          Babel.objectTypeProperty(
            Babel.identifier('foo'),
            Babel.stringTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.identifier('bar'),
            Babel.numberTypeAnnotation()
          ),
          Babel.objectTypeSpreadProperty(
            Babel.genericTypeAnnotation(Babel.identifier('AnotherType'))
          ),
          Babel.objectTypeProperty(
            Babel.identifier('baz'),
            Babel.booleanTypeAnnotation()
          ),
          Babel.objectTypeSpreadProperty(
            Babel.genericTypeAnnotation(Babel.identifier('YetAnotherType'))
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        typeIntersection([
          mockNodeWithValue(
            Babel.genericTypeAnnotation(Babel.identifier('SomeType'))
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
          ]),
          mockNodeWithValue(
            Babel.genericTypeAnnotation(Babel.identifier('AnotherType'))
          ),
          typeLiteral([
            typePropertySignature(
              identifier('baz'),
              typeAnnotation(typeBoolean())
            ),
          ]),
          mockNodeWithValue(
            Babel.genericTypeAnnotation(Babel.identifier('YetAnotherType'))
          ),
        ])
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with ObjectTypeIndexer', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation(
          [],
          [
            Babel.objectTypeIndexer(
              null,
              Babel.stringTypeAnnotation(),
              Babel.numberTypeAnnotation()
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        typeLiteral([
          typeIndexSignature(typeString(), typeAnnotation(typeNumber())),
        ])
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with multiple ObjectTypeIndexers', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation(
          [],
          [
            Babel.objectTypeIndexer(
              null,
              Babel.stringTypeAnnotation(),
              Babel.numberTypeAnnotation()
            ),
            Babel.objectTypeIndexer(
              null,
              Babel.numberTypeAnnotation(),
              Babel.booleanTypeAnnotation()
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
          typeAny(),
          `ROBLOX TODO: Unhandled node for type: ObjectTypeAnnotation when multiple indexers are present`
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with ObjectTypeCallProperty', () => {
      const source = `type Foo = { (): any }`;
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation(
          [],
          [],
          [
            withLocation({ start: 13, end: 20 })(
              Babel.objectTypeCallProperty(
                Babel.functionTypeAnnotation(
                  null,
                  [],
                  null,
                  Babel.anyTypeAnnotation()
                )
              )
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withInnerConversionComment(
          typeLiteral([]),
          'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
          '(): any'
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with multiple ObjectTypeCallProperties', () => {
      const source = `interface Foo { (): any, (string): string }`;
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation(
          [],
          [],
          [
            withLocation({ start: 16, end: 23 })(
              Babel.objectTypeCallProperty(
                Babel.functionTypeAnnotation(
                  null,
                  [],
                  null,
                  Babel.anyTypeAnnotation()
                )
              )
            ),
            withLocation({ start: 25, end: 41 })(
              Babel.objectTypeCallProperty(
                Babel.functionTypeAnnotation(
                  null,
                  [],
                  null,
                  Babel.anyTypeAnnotation()
                )
              )
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withInnerConversionComment(
          typeLiteral([]),
          'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
          '(): any',
          '(string): string'
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with ObjectTypeInternalSlot', () => {
      const source = `interface Foo { [[Slot]]: any }`;
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation(
          [],
          [],
          [],
          [
            withLocation({
              start: 16,
              end: 29,
            })(
              Babel.objectTypeInternalSlot(
                Babel.identifier('Slot'),
                Babel.anyTypeAnnotation(),
                false,
                false,
                false
              )
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withInnerConversionComment(
          typeLiteral([]),
          'ROBLOX TODO: Unhandled node for type: ObjectTypeInternalSlot',
          '[[Slot]]: any'
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with all possible properties', () => {
      const source = dedent`
      interface Foo {
        prop: string,
        ...Foo,
        [string]: boolean,
        (): any,
        (string): string,
        [[Slot]]: any,
      }
    `;
      const withSourceLocation = withLocationFromSource(source);

      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        exactObjectTypeAnnotation(
          [
            Babel.objectTypeProperty(
              Babel.identifier('prop'),
              Babel.stringTypeAnnotation()
            ),
            Babel.objectTypeSpreadProperty(
              Babel.genericTypeAnnotation(Babel.identifier('Foo'))
            ),
          ],
          [
            Babel.objectTypeIndexer(
              null,
              Babel.stringTypeAnnotation(),
              Babel.booleanTypeAnnotation()
            ),
          ],
          [
            withSourceLocation('(): any')(
              Babel.objectTypeCallProperty(
                Babel.functionTypeAnnotation(
                  null,
                  [],
                  null,
                  Babel.anyTypeAnnotation()
                )
              )
            ),
            withSourceLocation('(string): string')(
              Babel.objectTypeCallProperty(
                Babel.functionTypeAnnotation(
                  null,
                  [],
                  null,
                  Babel.anyTypeAnnotation()
                )
              )
            ),
          ],
          [
            withSourceLocation('[[Slot]]: any')(
              Babel.objectTypeInternalSlot(
                Babel.identifier('Slot'),
                Babel.anyTypeAnnotation(),
                false,
                false,
                false
              )
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        typeIntersection([
          mockNodeWithValue(
            Babel.genericTypeAnnotation(Babel.identifier('Foo'))
          ),
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
        ])
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });

  describe('- inexact', () => {
    const inexactObjectTypeAnnotation = (
      ...params: Parameters<typeof Babel.objectTypeAnnotation>
    ): ReturnType<typeof Babel.objectTypeAnnotation> => ({
      ...Babel.objectTypeAnnotation(...params),
      inexact: true,
    });

    it('should handle empty InterfaceDeclaration', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation([])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
          typeLiteral([]),
          "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with props with simple types', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation([
          Babel.objectTypeProperty(
            Babel.identifier('foo'),
            Babel.stringTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.identifier('bar'),
            Babel.numberTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.identifier('baz'),
            Babel.booleanTypeAnnotation()
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
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
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with props with simple types and string literals as keys', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation([
          Babel.objectTypeProperty(
            Babel.stringLiteral('foo'),
            Babel.stringTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.stringLiteral('bar'),
            Babel.numberTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.stringLiteral('baz'),
            Babel.booleanTypeAnnotation()
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
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
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with nested ObjectTypeAnnotation', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation([
          Babel.objectTypeProperty(
            Babel.identifier('nested'),
            inexactObjectTypeAnnotation([
              Babel.objectTypeProperty(
                Babel.identifier('foo'),
                Babel.stringTypeAnnotation()
              ),
              Babel.objectTypeProperty(
                Babel.identifier('bar'),
                Babel.numberTypeAnnotation()
              ),
              Babel.objectTypeProperty(
                Babel.identifier('baz'),
                Babel.booleanTypeAnnotation()
              ),
            ])
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
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
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with ObjectTypeSpreadProperty', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation([
          Babel.objectTypeSpreadProperty(
            Babel.genericTypeAnnotation(Babel.identifier('AnotherType'))
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
          mockNodeWithValue(
            Babel.genericTypeAnnotation(Babel.identifier('AnotherType'))
          ),
          "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with ObjectTypeSpreadProperty and additional props', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation([
          Babel.objectTypeSpreadProperty(
            Babel.genericTypeAnnotation(Babel.identifier('AnotherType'))
          ),
          Babel.objectTypeProperty(
            Babel.identifier('foo'),
            Babel.stringTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.identifier('bar'),
            Babel.numberTypeAnnotation()
          ),
          Babel.objectTypeProperty(
            Babel.identifier('baz'),
            Babel.booleanTypeAnnotation()
          ),
        ])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
          typeIntersection([
            mockNodeWithValue(
              Babel.genericTypeAnnotation(Babel.identifier('AnotherType'))
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
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with ObjectTypeIndexer', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation(
          [],
          [
            Babel.objectTypeIndexer(
              null,
              Babel.stringTypeAnnotation(),
              Babel.numberTypeAnnotation()
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
          typeLiteral([
            typeIndexSignature(typeString(), typeAnnotation(typeNumber())),
          ]),
          "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with multiple ObjectTypeIndexers', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation(
          [],
          [
            Babel.objectTypeIndexer(
              null,
              Babel.stringTypeAnnotation(),
              Babel.numberTypeAnnotation()
            ),
            Babel.objectTypeIndexer(
              null,
              Babel.numberTypeAnnotation(),
              Babel.booleanTypeAnnotation()
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
          typeAny(),
          `ROBLOX TODO: Unhandled node for type: ObjectTypeAnnotation when multiple indexers are present`
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with ObjectTypeCallProperty', () => {
      const source = `interface Foo { (): any }`;
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation(
          [],
          [],
          [
            withLocation({ start: 16, end: 23 })(
              Babel.objectTypeCallProperty(
                Babel.functionTypeAnnotation(
                  null,
                  [],
                  null,
                  Babel.anyTypeAnnotation()
                )
              )
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
          withInnerConversionComment(
            typeLiteral([]),
            'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
            '(): any'
          ),
          "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with multiple ObjectTypeCallProperties', () => {
      const source = `interface Foo { (): any, (string): string }`;
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation(
          [],
          [],
          [
            withLocation({ start: 16, end: 23 })(
              Babel.objectTypeCallProperty(
                Babel.functionTypeAnnotation(
                  null,
                  [],
                  null,
                  Babel.anyTypeAnnotation()
                )
              )
            ),
            withLocation({ start: 25, end: 41 })(
              Babel.objectTypeCallProperty(
                Babel.functionTypeAnnotation(
                  null,
                  [],
                  null,
                  Babel.anyTypeAnnotation()
                )
              )
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
          withInnerConversionComment(
            typeLiteral([]),
            'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
            '(): any',
            '(string): string'
          ),
          "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with ObjectTypeInternalSlot', () => {
      const source = `interface Foo { [[Slot]]: any }`;
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation(
          [],
          [],
          [],
          [
            withLocation({
              start: 16,
              end: 29,
            })(
              Babel.objectTypeInternalSlot(
                Babel.identifier('Slot'),
                Babel.anyTypeAnnotation(),
                false,
                false,
                false
              )
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
          withInnerConversionComment(
            typeLiteral([]),
            'ROBLOX TODO: Unhandled node for type: ObjectTypeInternalSlot',
            '[[Slot]]: any'
          ),
          "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle InterfaceDeclaration with all possible properties', () => {
      const source = dedent`
      interface Foo {
        prop: string,
        ...Foo,
        [string]: boolean,
        (): any,
        (string): string,
        [[Slot]]: any,
      }
    `;
      const withSourceLocation = withLocationFromSource(source);

      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        inexactObjectTypeAnnotation(
          [
            Babel.objectTypeProperty(
              Babel.identifier('prop'),
              Babel.stringTypeAnnotation()
            ),
            Babel.objectTypeSpreadProperty(
              Babel.genericTypeAnnotation(Babel.identifier('Foo'))
            ),
          ],
          [
            Babel.objectTypeIndexer(
              null,
              Babel.stringTypeAnnotation(),
              Babel.booleanTypeAnnotation()
            ),
          ],
          [
            withSourceLocation('(): any')(
              Babel.objectTypeCallProperty(
                Babel.functionTypeAnnotation(
                  null,
                  [],
                  null,
                  Babel.anyTypeAnnotation()
                )
              )
            ),
            withSourceLocation('(string): string')(
              Babel.objectTypeCallProperty(
                Babel.functionTypeAnnotation(
                  null,
                  [],
                  null,
                  Babel.anyTypeAnnotation()
                )
              )
            ),
          ],
          [
            withSourceLocation('[[Slot]]: any')(
              Babel.objectTypeInternalSlot(
                Babel.identifier('Slot'),
                Babel.anyTypeAnnotation(),
                false,
                false,
                false
              )
            ),
          ]
        )
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        withTrailingConversionComment(
          typeIntersection([
            mockNodeWithValue(
              Babel.genericTypeAnnotation(Babel.identifier('Foo'))
            ),
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
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });

  it('should handle InterfaceDeclaration with generic param', () => {
    const given = Babel.interfaceDeclaration(
      Babel.identifier('Foo'),
      Babel.typeParameterDeclaration([{ ...Babel.typeParameter(), name: 'T' }]),
      undefined,
      Babel.objectTypeAnnotation([])
    );
    const expected = typeAliasDeclaration(
      identifier('Foo'),
      typeLiteral([]),
      typeParameterDeclaration([typeReference(identifier('T'))])
    );

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should handle InterfaceDeclaration with multiple generic params', () => {
    const given = Babel.interfaceDeclaration(
      Babel.identifier('Foo'),
      Babel.typeParameterDeclaration([
        { ...Babel.typeParameter(), name: 'T' },
        { ...Babel.typeParameter(), name: 'V' },
        { ...Babel.typeParameter(), name: 'W' },
      ]),
      undefined,
      Babel.objectTypeAnnotation([])
    );
    const expected = typeAliasDeclaration(
      identifier('Foo'),
      typeLiteral([]),
      typeParameterDeclaration([
        typeReference(identifier('T')),
        typeReference(identifier('V')),
        typeReference(identifier('W')),
      ])
    );

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should handle InterfaceDeclaration with empty generic params', () => {
    const given = Babel.interfaceDeclaration(
      Babel.identifier('Foo'),
      Babel.typeParameterDeclaration([]),
      undefined,
      Babel.objectTypeAnnotation([])
    );
    const expected = typeAliasDeclaration(identifier('Foo'), typeLiteral([]));

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should handle InterfaceDeclaration with extended interface', () => {
    const given = Babel.interfaceDeclaration(
      Babel.identifier('Foo'),
      undefined,
      [Babel.interfaceExtends(Babel.identifier('Bar'))],
      Babel.objectTypeAnnotation([])
    );
    const expected = typeAliasDeclaration(
      identifier('Foo'),
      typeIntersection([typeReference(identifier('Bar')), typeLiteral([])])
    );

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should handle InterfaceDeclaration with multiple extended interfaces', () => {
    const given = Babel.interfaceDeclaration(
      Babel.identifier('Foo'),
      undefined,
      [
        Babel.interfaceExtends(Babel.identifier('Bar')),
        Babel.interfaceExtends(Babel.identifier('Baz')),
        Babel.interfaceExtends(Babel.identifier('Fizz')),
      ],
      Babel.objectTypeAnnotation([])
    );
    const expected = typeAliasDeclaration(
      identifier('Foo'),
      typeIntersection([
        typeReference(identifier('Bar')),
        typeReference(identifier('Baz')),
        typeReference(identifier('Fizz')),
        typeLiteral([]),
      ])
    );

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should handle InterfaceDeclaration with multiple extended generic interfaces', () => {
    const given = Babel.interfaceDeclaration(
      Babel.identifier('Foo'),
      Babel.typeParameterDeclaration([
        { ...Babel.typeParameter(), name: 'T' },
        { ...Babel.typeParameter(), name: 'V' },
        { ...Babel.typeParameter(), name: 'W' },
      ]),
      [
        Babel.interfaceExtends(
          Babel.identifier('Bar'),
          Babel.typeParameterInstantiation([
            Babel.genericTypeAnnotation(Babel.identifier('W')),
          ])
        ),
        Babel.interfaceExtends(
          Babel.identifier('Baz'),
          Babel.typeParameterInstantiation([
            Babel.genericTypeAnnotation(Babel.identifier('T')),
          ])
        ),
        Babel.interfaceExtends(
          Babel.identifier('Fizz'),
          Babel.typeParameterInstantiation([
            Babel.genericTypeAnnotation(Babel.identifier('V')),
          ])
        ),
      ],
      Babel.objectTypeAnnotation([])
    );
    const expected = typeAliasDeclaration(
      identifier('Foo'),
      typeIntersection([
        typeReference(identifier('Bar'), [
          mockNodeWithValue(Babel.genericTypeAnnotation(Babel.identifier('W'))),
        ]),
        typeReference(identifier('Baz'), [
          mockNodeWithValue(Babel.genericTypeAnnotation(Babel.identifier('T'))),
        ]),
        typeReference(identifier('Fizz'), [
          mockNodeWithValue(Babel.genericTypeAnnotation(Babel.identifier('V'))),
        ]),
        typeLiteral([]),
      ]),
      typeParameterDeclaration([
        typeReference(identifier('T')),
        typeReference(identifier('V')),
        typeReference(identifier('W')),
      ])
    );

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should handle InterfaceDeclaration with empty extended interfaces', () => {
    const given = Babel.interfaceDeclaration(
      Babel.identifier('Foo'),
      undefined,
      [],
      Babel.objectTypeAnnotation([])
    );
    const expected = typeAliasDeclaration(identifier('Foo'), typeLiteral([]));

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should return unhandled statement for InterfaceDeclaration with mixins array', () => {
    const given = {
      ...Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        Babel.objectTypeAnnotation([])
      ),
      mixins: [Babel.interfaceExtends(Babel.identifier('Mixin'))],
    };
    const expected = withTrailingConversionComment(
      unhandledStatement(),
      'ROBLOX TODO: Unhandled node for type: InterfaceDeclaration with mixins array'
    );

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should return unhandled statement for InterfaceDeclaration with implements array', () => {
    const given = {
      ...Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        undefined,
        Babel.objectTypeAnnotation([])
      ),
      implements: [Babel.classImplements(Babel.identifier('SomeClass'))],
    };
    const expected = withTrailingConversionComment(
      unhandledStatement(),
      'ROBLOX TODO: Unhandled node for type: InterfaceDeclaration with implements array'
    );

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  describe('comments', () => {
    it('should preserve comments on empty InterfaceDeclaration', () => {
      const given = withBabelComments(
        Babel.interfaceDeclaration(
          Babel.identifier('Foo'),
          undefined,
          undefined,
          Babel.objectTypeAnnotation([])
        )
      );
      const expected = withLuaComments(
        typeAliasDeclaration(identifier('Foo'), typeLiteral([]))
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should preserve comments on InterfaceDeclaration with generic params', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        withBabelComments(
          Babel.typeParameterDeclaration([
            withBabelComments(
              { ...Babel.typeParameter(), name: 'T' },
              'param T'
            ),
            withBabelComments(
              { ...Babel.typeParameter(), name: 'V' },
              'param V'
            ),
            withBabelComments(
              { ...Babel.typeParameter(), name: 'W' },
              'param W'
            ),
          ]),
          'params declaration'
        ),
        undefined,
        Babel.objectTypeAnnotation([])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        typeLiteral([]),
        withLuaComments(
          typeParameterDeclaration([
            withLuaComments(typeReference(identifier('T')), 'param T'),
            withLuaComments(typeReference(identifier('V')), 'param V'),
            withLuaComments(typeReference(identifier('W')), 'param W'),
          ]),
          'params declaration'
        )
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should preserve comments on InterfaceDeclaration with extended interfaces', () => {
      const given = Babel.interfaceDeclaration(
        Babel.identifier('Foo'),
        undefined,
        [
          withBabelComments(
            Babel.interfaceExtends(Babel.identifier('Bar')),
            'extends Bar'
          ),
          withBabelComments(
            Babel.interfaceExtends(Babel.identifier('Baz')),
            'extends Baz'
          ),
          withBabelComments(
            Babel.interfaceExtends(Babel.identifier('Fizz')),
            'extends Fizz'
          ),
        ],
        Babel.objectTypeAnnotation([])
      );
      const expected = typeAliasDeclaration(
        identifier('Foo'),
        typeIntersection([
          withLuaComments(typeReference(identifier('Bar')), 'extends Bar'),
          withLuaComments(typeReference(identifier('Baz')), 'extends Baz'),
          withLuaComments(typeReference(identifier('Fizz')), 'extends Fizz'),
          typeLiteral([]),
        ])
      );

      const actual = handler(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });
});

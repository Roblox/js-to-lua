import * as Babel from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import {
  FlowBuiltInTypeId,
  withFlowBuiltInTypeExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaIdentifier,
  LuaType,
  typeReference,
} from '@js-to-lua/lua-types';
import {
  createFlowGenericTypeBuiltInAnnotationHandler,
  handleFlowIdentifier,
} from './flow-generic-type-built-in-annotation.handler';

const { mockNodeWithValueHandler } = testUtils;

describe('FlowGenericType built-in annotation handler', () => {
  type IdentifierHandlerFunction = Parameters<
    typeof createHandlerFunction<LuaIdentifier, Babel.Identifier>
  >[0];
  const mockIdentifierHandler = jest.fn<
    ReturnType<IdentifierHandlerFunction>,
    Parameters<IdentifierHandlerFunction>
  >((...args) => mockNodeWithValueHandler(...args));

  const handleFlowGenericTypeBuiltIn =
    createFlowGenericTypeBuiltInAnnotationHandler(
      createHandlerFunction(mockIdentifierHandler),
      mockNodeWithValueHandler
    );

  const source = '';

  beforeEach(() => {
    mockIdentifierHandler.mockImplementation((...args) =>
      mockNodeWithValueHandler(...args)
    );
  });

  it.each(
    Array<{ name: FlowBuiltInTypeId; generics: string[] }>(
      {
        name: '$Keys',
        generics: ['T'],
      },
      {
        name: '$Values',
        generics: ['T'],
      },
      {
        name: '$Diff',
        generics: ['T', 'K'],
      },
      {
        name: 'Class',
        generics: ['T'],
      }
    )
  )('should handle built-in types', ({ name, generics }) => {
    mockIdentifierHandler.mockImplementation((source, config, node) =>
      identifier(node.name)
    );

    const given = Babel.genericTypeAnnotation(
      Babel.identifier(name),
      Babel.typeParameterInstantiation([])
    );

    const typeName = handleFlowIdentifier(Babel.identifier(name))
      .name as FlowBuiltInTypeId;

    const expected = withFlowBuiltInTypeExtra<LuaType, FlowBuiltInTypeId>(
      typeName,
      generics
    )(typeReference(identifier(typeName)));

    const actual = handleFlowGenericTypeBuiltIn(source, {}, given);

    expect(actual).toEqual(expected);
  });

  it.each(['NotKeys', 'NotValues', 'NotDiff', 'NotClass'])(
    'should NOT handle NOT built-in types',
    (name) => {
      mockIdentifierHandler.mockImplementation((source, config, node) =>
        identifier(node.name)
      );

      const given = Babel.genericTypeAnnotation(
        Babel.identifier(name),
        Babel.typeParameterInstantiation([])
      );

      const expected = undefined;

      const actual = handleFlowGenericTypeBuiltIn(source, {}, given);

      expect(actual).toEqual(expected);
    }
  );
});

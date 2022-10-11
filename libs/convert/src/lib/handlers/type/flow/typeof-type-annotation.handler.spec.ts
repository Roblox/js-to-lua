import * as Babel from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import {
  identifier,
  LuaType,
  typeQuery,
  typeReference,
} from '@js-to-lua/lua-types';
import { createFlowTypeofTypeAnnotationHandler } from './typeof-type-annotation.handler';

const { withBabelComments, withLuaComments, mockNodeWithValueHandler } =
  testUtils;

describe('Flow - TypeofTypeAnnotation handler', () => {
  type FlowTypeHandlerFunction = Parameters<
    typeof createHandlerFunction<LuaType, Babel.FlowType>
  >[0];
  const mockFlowTypeHandler = jest.fn<
    ReturnType<FlowTypeHandlerFunction>,
    Parameters<FlowTypeHandlerFunction>
  >((...args) => mockNodeWithValueHandler(...args));

  const handler = createFlowTypeofTypeAnnotationHandler(
    createHandlerFunction<LuaType, Babel.FlowType>(mockFlowTypeHandler)
  ).handler;

  const source = '';

  it('should handle node', () => {
    mockFlowTypeHandler.mockImplementationOnce(() =>
      typeReference(identifier('foo'))
    );

    const given = Babel.typeofTypeAnnotation(
      Babel.genericTypeAnnotation(Babel.identifier('foo'))
    );
    const expected = typeQuery(identifier('foo'));

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should preserve comments', () => {
    mockFlowTypeHandler.mockImplementationOnce(() =>
      typeReference(withLuaComments(identifier('foo'), 'identifier'))
    );

    const given = withBabelComments(
      Babel.typeofTypeAnnotation(
        withBabelComments(
          Babel.genericTypeAnnotation(
            withBabelComments(Babel.identifier('foo'), 'identifier')
          ),
          'generic type'
        )
      ),
      'typeof'
    );
    const expected = withLuaComments(
      typeQuery(
        withLuaComments(
          withLuaComments(identifier('foo'), 'identifier'),
          'generic type'
        )
      ),
      'typeof'
    );

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });
});

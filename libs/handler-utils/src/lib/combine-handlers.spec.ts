import {
  booleanLiteral as babelBooleanLiteral,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import { LuaNode } from '@js-to-lua/lua-types';
import { combineHandlers } from './combine-handlers';
import { createHandlerFunction } from './create-handler-function';
import { mockNodeHandler } from './test-utils';
import {
  BabelNode,
  BaseNodeHandler,
  BaseNodeHandlerSymbol,
  EmptyConfig,
} from './types';

jest.mock('./test-utils');

const source = '';

describe('Combine Handlers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use default handler if no handler provided', () => {
    combineHandlers(Array<BaseNodeHandler<LuaNode>>(), mockNodeHandler).handler(
      source,
      {},
      babelStringLiteral('123')
    );

    expect(mockNodeHandler).toHaveBeenCalled();
  });

  it('should use provided handler', () => {
    const handler = jest.fn<LuaNode, [string, BabelNode]>().mockReturnValue({
      type: 'StringLiteral',
      value: '123',
    });

    const handlers: BaseNodeHandler<LuaNode>[] = [
      {
        [BaseNodeHandlerSymbol]: true,
        type: 'StringLiteral',
        handler: createHandlerFunction(handler),
      },
    ];

    combineHandlers(handlers, mockNodeHandler).handler(
      source,
      {},
      babelStringLiteral('123')
    );

    expect(mockNodeHandler).not.toHaveBeenCalled();

    expect(handler).toHaveBeenCalled();
  });

  it('should use correct handler ', () => {
    const givenStringLiteral = babelStringLiteral('123');
    const givenNumericLiteral = babelNumericLiteral(1);

    const handlerString = jest
      .fn<LuaNode, [string, EmptyConfig, BabelNode]>()
      .mockReturnValue({
        type: 'StringLiteral',
        value: '123',
      });
    const handlerNumeric = jest
      .fn<LuaNode, [string, EmptyConfig, BabelNode]>()
      .mockReturnValue({
        type: 'NumericLiteral',
        value: 1,
      });

    const handlers: BaseNodeHandler<LuaNode>[] = [
      {
        [BaseNodeHandlerSymbol]: true,
        type: 'StringLiteral',
        handler: createHandlerFunction(handlerString),
      },
      {
        [BaseNodeHandlerSymbol]: true,
        type: 'NumericLiteral',
        handler: createHandlerFunction(handlerNumeric),
      },
    ];

    const { handler } = combineHandlers(handlers, mockNodeHandler);

    handler(source, {}, givenStringLiteral);
    handler(source, {}, givenNumericLiteral);

    expect(mockNodeHandler).not.toHaveBeenCalled();

    expect(handlerString).toHaveBeenCalledWith('', {}, givenStringLiteral);
    expect(handlerString).not.toHaveBeenCalledWith('', {}, givenNumericLiteral);

    expect(handlerNumeric).toHaveBeenCalledWith('', {}, givenNumericLiteral);
    expect(handlerNumeric).not.toHaveBeenCalledWith('', {}, givenStringLiteral);
  });

  it('should use default handler if no matching handler', () => {
    const givenBooleanLiteral = babelBooleanLiteral(true);

    const handlerString = jest
      .fn<LuaNode, [string, BabelNode]>()
      .mockReturnValue({
        type: 'StringLiteral',
        value: '123',
      });
    const handlerNumeric = jest
      .fn<LuaNode, [string, BabelNode]>()
      .mockReturnValue({
        type: 'NumericLiteral',
        value: 1,
      });

    const handlers: BaseNodeHandler<LuaNode>[] = [
      {
        [BaseNodeHandlerSymbol]: true,
        type: 'StringLiteral',
        handler: createHandlerFunction(handlerString),
      },
      {
        [BaseNodeHandlerSymbol]: true,
        type: 'NumericLiteral',
        handler: createHandlerFunction(handlerNumeric),
      },
    ];

    const { handler } = combineHandlers(handlers, mockNodeHandler);

    handler(source, {}, givenBooleanLiteral);

    expect(mockNodeHandler).toHaveBeenCalledWith('', {}, givenBooleanLiteral);
    expect(handlerString).not.toHaveBeenCalled();
    expect(handlerNumeric).not.toHaveBeenCalled();
  });
});

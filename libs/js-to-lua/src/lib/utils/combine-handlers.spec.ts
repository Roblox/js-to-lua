import { combineHandlers } from './combine-handlers';
import {
  BabelNode,
  BaseNodeHandler,
  createHandlerFunction,
  EmptyConfig,
} from '../types';
import { LuaNode } from '@js-to-lua/lua-types';
import { mockNodeHandler } from '../testUtils/mock-node';
import {
  booleanLiteral as babelBooleanLiteral,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
} from '@babel/types';

jest.mock('../testUtils/mock-node');

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
        type: 'StringLiteral',
        handler: createHandlerFunction(handlerString),
      },
      {
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
        type: 'StringLiteral',
        handler: createHandlerFunction(handlerString),
      },
      {
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

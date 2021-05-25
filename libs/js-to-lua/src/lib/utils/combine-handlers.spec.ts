import { combineHandlers } from './combine-handlers';
import { defaultHandler } from './default.handler';
import { BabelNode, BaseNodeHandler } from '../types';
import { LuaNode } from '@js-to-lua/lua-types';

jest.mock('./default.handler');

describe('Combine Handlers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use default handler if no handler provided', () => {
    combineHandlers<BaseNodeHandler>([]).handler({
      type: 'StringLiteral',
      start: 0,
      end: 1,
    });

    expect(defaultHandler).toHaveBeenCalled();
  });

  it('should use provided handler', () => {
    const handler = jest.fn<LuaNode, [BabelNode]>().mockReturnValue({
      type: 'StringLiteral',
      value: '123',
    });

    const handlers: BaseNodeHandler[] = [
      {
        type: 'StringLiteral',
        handler,
      },
    ];

    combineHandlers(handlers).handler({
      type: 'StringLiteral',
      start: 0,
      end: 1,
    });

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(handler).toHaveBeenCalled();
  });

  it('should use correct handler ', () => {
    const givenStringLiteral: BabelNode = {
      type: 'StringLiteral',
      start: 0,
      end: 1,
    };
    const givenNumericLiteral: BabelNode = {
      type: 'NumericLiteral',
      start: 0,
      end: 1,
    };

    const handlerString = jest.fn<LuaNode, [BabelNode]>().mockReturnValue({
      type: 'StringLiteral',
      value: '123',
    });
    const handlerNumeric = jest.fn<LuaNode, [BabelNode]>().mockReturnValue({
      type: 'NumericLiteral',
      value: 1,
    });

    const handlers: BaseNodeHandler[] = [
      {
        type: 'StringLiteral',
        handler: handlerString,
      },
      {
        type: 'NumericLiteral',
        handler: handlerNumeric,
      },
    ];

    const { handler } = combineHandlers(handlers);

    handler(givenStringLiteral);
    handler(givenNumericLiteral);

    expect(defaultHandler).not.toHaveBeenCalled();

    expect(handlerString).toHaveBeenCalledWith(givenStringLiteral);
    expect(handlerString).not.toHaveBeenCalledWith(givenNumericLiteral);

    expect(handlerNumeric).toHaveBeenCalledWith(givenNumericLiteral);
    expect(handlerNumeric).not.toHaveBeenCalledWith(givenStringLiteral);
  });

  it('should use default handler if no matching handler', () => {
    const givenBooleanLiteral: BabelNode = {
      type: 'BooleanLiteral',
      start: 0,
      end: 1,
    };

    const handlerString = jest.fn<LuaNode, [BabelNode]>().mockReturnValue({
      type: 'StringLiteral',
      value: '123',
    });
    const handlerNumeric = jest.fn<LuaNode, [BabelNode]>().mockReturnValue({
      type: 'NumericLiteral',
      value: 1,
    });

    const handlers: BaseNodeHandler[] = [
      {
        type: 'StringLiteral',
        handler: handlerString,
      },
      {
        type: 'NumericLiteral',
        handler: handlerNumeric,
      },
    ];

    const { handler } = combineHandlers(handlers);

    handler(givenBooleanLiteral);

    expect(defaultHandler).toHaveBeenCalledWith(givenBooleanLiteral);
    expect(handlerString).not.toHaveBeenCalled();
    expect(handlerNumeric).not.toHaveBeenCalled();
  });
});

import { mockNode, mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createHandlerFunction } from '../create-handler-function';
import { EmptyConfig } from '../types';

export const mockNodeHandler = createHandlerFunction(mockNode);
export const mockNodeWithValueHandler = createHandlerFunction(
  <T>(source: string, config: EmptyConfig, node: T) => mockNodeWithValue(node)
);

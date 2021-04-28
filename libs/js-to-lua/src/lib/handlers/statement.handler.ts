import { combineHandlers } from '../utils/combine-handlers';
import { BaseNodeHandler } from '../types';
import { Statement } from '@babel/types';
import { handleExpressionStatement } from './expression-statement.handler';

export const handleStatement = combineHandlers<BaseNodeHandler<Statement>>([
  handleExpressionStatement,
]);

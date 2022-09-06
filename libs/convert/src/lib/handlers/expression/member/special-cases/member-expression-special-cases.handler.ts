import { combineOptionalHandlerFunctions } from '@js-to-lua/handler-utils';
import { createMemberExpressionKnownMathPropertyHandlerFunction } from './known-math-properties/member-expression-known-math-properties.handler';

export const createMemberExpressionSpecialCasesHandler = () =>
  combineOptionalHandlerFunctions([
    createMemberExpressionKnownMathPropertyHandlerFunction(),
  ]);

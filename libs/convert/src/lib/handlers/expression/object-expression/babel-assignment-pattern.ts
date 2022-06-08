import * as Babel from '@babel/types';

export const isBabelAssignmentPattern = (
  param: unknown
): param is Babel.AssignmentPattern => Babel.isAssignmentPattern(param as any);

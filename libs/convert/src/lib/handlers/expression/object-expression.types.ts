import { ObjectExpression, SpreadElement } from '@babel/types';
import { Unpacked } from '@js-to-lua/shared-utils';

export type ObjectExpressionProperty = Unpacked<ObjectExpression['properties']>;

export type NoSpreadObjectProperty = Exclude<
  Unpacked<ObjectExpression['properties']>,
  SpreadElement
>;

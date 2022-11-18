import * as Babel from '@babel/types';
import { Omit } from 'yargs';

const CHALK_NAME = 'chalk' as const;
type ChalkName = typeof CHALK_NAME;
type ChalkIdentifier = Omit<Babel.Identifier, 'name'> & { name: ChalkName };

export type ChalkCallee = Omit<Babel.MemberExpression, 'object'> & {
  object: ChalkIdentifier;
};

export type NestedChalkCallee = Omit<Babel.MemberExpression, 'object'> & {
  object: NestedChalkCallee | ChalkCallee;
};

export const isChalkIdentifier = (node: Babel.Node): node is ChalkIdentifier =>
  Babel.isIdentifier(node) && node.name === CHALK_NAME;

export const isChalkCallee = (node: Babel.Node): node is ChalkCallee => {
  return Babel.isMemberExpression(node) && isChalkIdentifier(node.object);
};

export const isNestedChalkCallee = (
  node: Babel.Node
): node is NestedChalkCallee => {
  return (
    Babel.isMemberExpression(node) &&
    Babel.isMemberExpression(node.object) &&
    (isChalkCallee(node.object) || isNestedChalkCallee(node.object))
  );
};

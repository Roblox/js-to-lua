import { Expression, Identifier } from '@babel/types';

export function generateUniqueIdentifier(
  nodes: Expression[],
  defaultValue: string
): string {
  return nodes
    .filter((node) => node.type === 'Identifier')
    .some((node) => (node as Identifier).name === defaultValue)
    ? generateUniqueIdentifier(nodes, `${defaultValue}_`)
    : defaultValue;
}

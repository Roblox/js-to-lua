import { PrintableNode } from './fmt';

export const prependString =
  (prefix: string) => (str: string | PrintableNode) =>
    `${prefix}${str}`;

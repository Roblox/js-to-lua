import {
  NeedsPackagesExtra,
  WithExtras,
  withExtras,
} from '@js-to-lua/lua-conversion-utils';
import { identifier, LuaNode } from '@js-to-lua/lua-types';

export const jestGlobalsIdentifier = identifier('JestGlobals');

const jestGlobals = [
  'describe',
  'it',
  'test',
  'beforeAll',
  'afterAll',
  'beforeEach',
  'afterEach',
] as const;

const jestGlobalsSorted = [...jestGlobals].sort();

type JestGlobal = typeof jestGlobals[number];

export const isJestGlobal = (id: string): id is JestGlobal =>
  jestGlobals.includes(id as JestGlobal);

type JestGlobalName<S extends string> = `jestGlobal.${S}`;

type JestGlobalExtra<S extends string> = {
  [Property in JestGlobalName<S>]: true;
} & NeedsPackagesExtra;

const jestGlobalExtra = <P extends JestGlobal>(p: P): JestGlobalExtra<P> =>
  ({
    needsPackages: true,
    [`jestGlobal.${p}`]: true,
  } as JestGlobalExtra<P>);

export const withJestGlobalExtra = <N extends LuaNode, P extends JestGlobal>(
  jestGlobal: P
) => withExtras<JestGlobalExtra<P>, N>(jestGlobalExtra(jestGlobal));

export const hasJestGlobalExtra = <N extends LuaNode, P extends JestGlobal>(
  polyfillIdentifier: P,
  node: N
): node is WithExtras<N, JestGlobalExtra<P>> =>
  node.extras?.[`jestGlobal.${polyfillIdentifier}`] === true;

export const removeJestGlobalExtra = <N extends LuaNode, P extends JestGlobal>(
  polyfillIdentifier: P,
  node: N
): N => {
  if (hasJestGlobalExtra(polyfillIdentifier, node)) {
    delete node.extras[`jestGlobal.${polyfillIdentifier}`];
  }
  return node;
};

export const getJestGlobals = (node: LuaNode) =>
  jestGlobalsSorted.filter((id) => hasJestGlobalExtra(id, node));

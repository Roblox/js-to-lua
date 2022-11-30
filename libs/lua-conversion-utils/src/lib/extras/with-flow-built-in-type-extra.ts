import { LuaNode } from '@js-to-lua/lua-types';
import { withExtras } from './extras';

export const flowBuiltInTypeIds = [
  '$Keys',
  '$Values',
  '$ReadOnly',
  '$Exact',
  '$Diff',
  '$Rest',
  '$PropertyType',
  '$ElementType',
  '$NonMaybeType',
  '$ObjMap',
  '$ObjMapi',
  '$ObjMapConst',
  '$KeyMirror',
  '$TupleMap',
  '$Call',
  'Class',
  '$Shape',
  '$Exports',
  '$Supertype',
  '$Subtype',
] as const;

export type FlowBuiltInTypeId = typeof flowBuiltInTypeIds[number];

const requiresFlowTypeBuiltInMap: {
  [P in FlowBuiltInTypeId]: {
    name: string;
    generics?: string[];
  };
} = {
  $Keys: { name: 'Keys', generics: ['T'] },
  $Values: { name: 'Values', generics: ['T'] },
  $ReadOnly: { name: 'ReadOnly', generics: ['T'] },
  $Exact: { name: 'Exact', generics: ['T'] },
  $Diff: { name: 'Diff', generics: ['T', 'K'] },
  $Rest: { name: 'Rest', generics: ['T', 'K'] },
  $PropertyType: { name: 'PropertyType', generics: ['T', 'K'] },
  $ElementType: { name: 'ElementType', generics: ['T', 'K'] },
  $NonMaybeType: { name: 'NonMaybeType', generics: ['T'] },
  $ObjMap: { name: 'ObjMap', generics: ['T', 'F'] },
  $ObjMapi: { name: 'ObjMapi', generics: ['T', 'F'] },
  $ObjMapConst: { name: 'ObjMapConst', generics: ['O', 'T'] },
  $KeyMirror: { name: 'KeyMirror', generics: ['O'] },
  $TupleMap: { name: 'TupleMap', generics: ['T', 'F'] },
  $Call: { name: 'Call', generics: ['F', 'T...'] },
  Class: { name: 'Class', generics: ['T'] },
  $Shape: { name: 'Shape', generics: ['T'] },
  $Exports: { name: 'Exports', generics: ['T'] },
  $Supertype: { name: 'Supertype', generics: ['T'] },
  $Subtype: { name: 'Subtype', generics: ['T'] },
};

export const requiresFlowBuiltInType = flowBuiltInTypeIds.map(
  (key) => requiresFlowTypeBuiltInMap[key]
);

const flowBuiltInTypeprefix = 'FlowBuiltInTypeIds' as const;
type FlowBuiltInTypePrefix = typeof flowBuiltInTypeprefix;

type FlowBuiltInTypeName<S extends FlowBuiltInTypeId> =
  `${FlowBuiltInTypePrefix}.${S}`;

type FlowBuiltInTypeExtra<S extends FlowBuiltInTypeId> = {
  [Property in FlowBuiltInTypeName<S>]: {
    name: S;
    generics?: string[];
  };
};

const flowBuiltInTypeExtra = <P extends FlowBuiltInTypeId>(
  name: P,
  generics?: string[]
): FlowBuiltInTypeExtra<P> =>
  ({
    [`${flowBuiltInTypeprefix}.${name}`]: {
      name,
      ...(generics ? { generics } : {}),
    },
  } as FlowBuiltInTypeExtra<P>);

export const withFlowBuiltInTypeExtra = <
  N extends LuaNode,
  P extends FlowBuiltInTypeId
>(
  name: P,
  generics?: string[]
) =>
  withExtras<FlowBuiltInTypeExtra<P>, N>(flowBuiltInTypeExtra(name, generics));

export const getFlowBuiltInTypeExtra = <N extends LuaNode>(node: N) => {
  const extras = node.extras || {};
  return Object.keys(extras)
    .filter((key) => key.startsWith(`${flowBuiltInTypeprefix}.`))
    .map((key) => key.split('.')[1])
    .sort()
    .map(
      (key) =>
        extras[`${flowBuiltInTypeprefix}.${key}`] as {
          name: string;
          generics?: string[];
        }
    )
    .filter(
      (extra): extra is { name: FlowBuiltInTypeId; generics?: string[] } =>
        (flowBuiltInTypeIds as ReadonlyArray<string>)
          .map((key) => key.slice(key.startsWith('$') ? 1 : 0))
          .includes(extra.name)
    );
};

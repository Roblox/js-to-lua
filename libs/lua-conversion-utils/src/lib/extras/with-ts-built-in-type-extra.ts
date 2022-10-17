import { LuaNode } from '@js-to-lua/lua-types';
import { hasOwnProperty } from '@js-to-lua/shared-utils';
import { withExtras } from './extras';

const tsBuiltInTypeIds = [
  'Awaited',
  'Partial',
  'Required',
  'Readonly',
  'Record',
  'Pick',
  'Omit',
  'Exclude',
  'Extract',
  'NonNullable',
  'Parameters',
  'ConstructorParameters',
  'ReturnType',
  'InstanceType',
  'ThisParameterType',
  'OmitThisParameter',
  'ThisType',
  'Uppercase',
  'Lowercase',
  'Capitalize',
  'Uncapitalize',
] as const;

export type TsBuiltInTypeId = typeof tsBuiltInTypeIds[number];

const requiresTsTypeBuiltInMap: {
  [P in TsBuiltInTypeId]: {
    name: P;
    generics?: string[];
  };
} = {
  Awaited: { name: 'Awaited', generics: ['T'] },
  Partial: { name: 'Partial', generics: ['T'] },
  Required: { name: 'Required', generics: ['T'] },
  Readonly: { name: 'Readonly', generics: ['T'] },
  Record: { name: 'Record', generics: ['K', 'T'] },
  Pick: { name: 'Pick', generics: ['T', 'K'] },
  Omit: { name: 'Omit', generics: ['T', 'K'] },
  Exclude: { name: 'Exclude', generics: ['T', 'U'] },
  Extract: { name: 'Extract', generics: ['T', 'U'] },
  NonNullable: { name: 'NonNullable', generics: ['T'] },
  Parameters: { name: 'Parameters', generics: ['T'] },
  ConstructorParameters: { name: 'ConstructorParameters', generics: ['T'] },
  ReturnType: { name: 'ReturnType', generics: ['T'] },
  InstanceType: { name: 'InstanceType', generics: ['T'] },
  ThisParameterType: { name: 'ThisParameterType', generics: ['T'] },
  OmitThisParameter: { name: 'OmitThisParameter', generics: ['T'] },
  ThisType: { name: 'ThisType', generics: ['T'] },
  Uppercase: { name: 'Uppercase', generics: ['S'] },
  Lowercase: { name: 'Lowercase', generics: ['S'] },
  Capitalize: { name: 'Capitalize', generics: ['S'] },
  Uncapitalize: { name: 'Uncapitalize', generics: ['S'] },
};

export const requiresTsBuiltInType = tsBuiltInTypeIds.map(
  (key) => requiresTsTypeBuiltInMap[key]
);

const tsBuiltInTypeprefix = 'tSBuiltInTypeIds' as const;
type TsBuiltInTypePrefix = typeof tsBuiltInTypeprefix;

type TsBuiltInTypeName<S extends TsBuiltInTypeId> =
  `${TsBuiltInTypePrefix}.${S}`;

type TsBuiltInTypeExtra<S extends TsBuiltInTypeId> = {
  [Property in TsBuiltInTypeName<S>]: {
    name: S;
    generics?: string[];
  };
};

const tsBuiltInTypeExtra = <P extends TsBuiltInTypeId>(
  name: P,
  generics?: string[]
): TsBuiltInTypeExtra<P> =>
  ({
    [`${tsBuiltInTypeprefix}.${name}`]: {
      name,
      ...(generics ? { generics } : {}),
    },
  } as TsBuiltInTypeExtra<P>);

export const withTsBuiltInTypeExtra = <
  N extends LuaNode,
  P extends TsBuiltInTypeId
>(
  name: P,
  generics?: string[]
) => withExtras<TsBuiltInTypeExtra<P>, N>(tsBuiltInTypeExtra(name, generics));

export const hasTsBuiltInTypeExtra = <P extends TsBuiltInTypeId>(
  name: P,
  node: LuaNode
) => {
  const extra = node.extras?.[`${tsBuiltInTypeprefix}.${name}`];
  return (
    extra !== null &&
    typeof extra === 'object' &&
    hasOwnProperty(extra, 'name') &&
    extra.name === name
  );
};

export const getTsBuiltInTypeExtra = <N extends LuaNode>(node: N) => {
  const extras = node.extras || {};
  return Object.keys(extras)
    .filter((key) => key.startsWith(`${tsBuiltInTypeprefix}.`))
    .map((key) => key.split('.')[1])
    .sort()
    .map(
      (key) =>
        extras[`${tsBuiltInTypeprefix}.${key}`] as {
          name: string;
          generics?: string[];
        }
    )
    .filter((extra): extra is { name: TsBuiltInTypeId; generics?: string[] } =>
      (tsBuiltInTypeIds as ReadonlyArray<string>).includes(extra.name)
    );
};

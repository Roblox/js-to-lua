export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type NonEmptyArray<T> = [T, ...T[]] | [...T[], T];

export const isNonEmptyArray = <T>(arr: T[]): arr is NonEmptyArray<T> =>
  arr.length > 0;

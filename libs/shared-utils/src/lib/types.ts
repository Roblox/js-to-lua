export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type NonEmptyArray<T> = [T, ...T[]] | [...T[], T];

export const isNonEmptyArray = <T>(arr: T[]): arr is NonEmptyArray<T> =>
  arr.length > 0;

export const isSingleElementArray = <T>(arr: T[]): arr is [T] =>
  arr.length === 1;

export type Override<T, V extends Partial<T>> = Omit<T, keyof V> & V;

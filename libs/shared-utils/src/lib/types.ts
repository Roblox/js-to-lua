export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type NonEmptyArray<T> = [T, ...T[]];

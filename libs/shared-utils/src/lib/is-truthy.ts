export type Truthy<T> = NonNullable<T>;

export const isTruthy = <T>(value: T): value is Truthy<T> => Boolean(value);

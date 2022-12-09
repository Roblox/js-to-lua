import { Conflict } from './conflict';

export type ConflictStrategy = (
  input: string,
  conflicts: Conflict[]
) => [string, Conflict[]];

import { ExecException } from 'node:child_process';

export interface ConversionOptions {
  targetRevision?: string;
  outDir?: string;
}

export type ConflictsSummary = Record<
  string,
  { conflicts: number; lines: number }
>;

export interface ComparisonResponse {
  failedFiles: Set<string>;
  stdout: string;
  stderr: string;
  patchPath: string;
  revision: string;
  conflictsSummary: ConflictsSummary;
}

export type UpstreamFileMap = Record<string, UpstreamReference>;

export interface UpstreamReference {
  ref: string;
  path: string;
}

export enum MergeSection {
  Resolved,
  Current,
  Incoming,
}

export interface ChildExecException extends ExecException {
  stdout?: string;
  stderr?: string;
}

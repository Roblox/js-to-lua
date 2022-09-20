import { ExecException } from 'node:child_process';

export interface ConversionOptions {
  targetRevision?: string;
  outDir?: string;
}

export interface ComparisonResponse {
  stdout: string;
  stderr: string;
}

export type SourceMapping = Record<string, UpstreamReference>;

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

export type QueryVariables = { [key: string]: string };

export interface ConversionConfigResponse {
  repository: {
    object: {
      text: string;
    };
  };
}

export type ReplaceFileTuple = [
  matchFn: (filename: string) => boolean,
  replaceFn: (filename: string) => string
];

export interface ConversionConfig {
  lastSync: {
    ref: string;
    conversionToolVersion: string;
  };
  upstream: {
    owner: string;
    repo: string;
    primaryBranch: string;
  };
  downstream: {
    primaryBranch: string;
    patterns: string[];
  };
  renameFiles?: Array<ReplaceFileTuple>;
}

export interface ReleaseResponse {
  repository: {
    releases: {
      edges: ReleaseEdge[];
    };
  };
}

export interface ReleaseEdge {
  cursor: string;
  node: Release;
}

export interface Release {
  name: string;
  tagName: string;
  tagCommit: {
    oid: string;
  };
  createdAt: string;
}

export interface CommitResponse {
  repository: {
    object: {
      oid?: string;
    };
  };
}

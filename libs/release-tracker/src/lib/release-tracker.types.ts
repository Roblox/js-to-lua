export type QueryVariables = { [key: string]: string };

export interface ConversionConfigResponse {
  repository: {
    object: {
      text: string;
    };
  };
}

export interface ConversionConfig {
  lastSync: {
    ref: string;
    conversionToolVersion: string;
  };
  upstream: {
    owner: string;
    repo: string;
    primaryBranch: string;
    patterns: string[];
  };
  downstream: {
    primaryBranch: string;
  };
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

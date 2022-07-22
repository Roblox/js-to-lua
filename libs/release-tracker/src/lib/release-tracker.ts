import { Octokit } from 'octokit';
import * as process from 'process';
import * as semver from 'semver';

import {
  CommitResponse,
  ConversionConfig,
  ConversionConfigResponse,
  QueryVariables,
  Release,
  ReleaseEdge,
  ReleaseResponse,
} from './release-tracker.types';

function sortByTagNameDesc(a: Release, b: Release) {
  if (semver.gt(a.tagName, b.tagName)) return -1;
  else if (semver.lt(a.tagName, b.tagName)) return 1;
  else return 0;
}

async function executeQuery<T>(
  query: string,
  variables: QueryVariables
): Promise<T> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      'Cannot download releases from GitHub as the GITHUB_TOKEN environment variable is unset.'
    );
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  return octokit.graphql(query, variables);
}

export async function getRepoConversionConfig(
  owner: string,
  name: string,
  ref?: string
): Promise<ConversionConfig> {
  const expression = `${
    ref ?? 'release-tracker-testing'
  }:js-to-lua.config.json`;

  const query = `
    query GetConversionConfig($owner: String!, $name: String!, $expression: String!) {
      repository(owner: $owner, name: $name) {
        object(expression: $expression) {
          ... on Blob {
            text
          }
        }
      }
    }
  `;

  const response = await executeQuery<ConversionConfigResponse>(query, {
    owner,
    name,
    expression,
  });

  return JSON.parse(response.repository.object.text);
}

export async function getLatestRepoRelease(
  owner: string,
  repo: string
): Promise<Release | null> {
  const query = `
    query GetReleases($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        releases(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
          edges {
            node {
              name
              tagName
              tagCommit {
                oid
              }
              createdAt
            }
          }
        }
      }
    }
  `;

  const response = await executeQuery<ReleaseResponse>(query, { owner, repo });

  const releases = response.repository.releases.edges
    .map((edge: ReleaseEdge) => edge.node)
    .sort(sortByTagNameDesc);

  return releases.length > 0 ? releases[0] : null;
}

export async function getLatestRepoCommit(
  owner: string,
  repo: string
): Promise<CommitResponse> {
  const query = `
    query GetLatestCommit($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        object(expression: "HEAD") {
          ... on Commit {
            oid
          }
        }
      }
    }
  `;

  return executeQuery<CommitResponse>(query, { owner, repo });
}

export async function checkForNewRelease(
  owner: string,
  repo: string
): Promise<{ release: Release; config: ConversionConfig } | null> {
  const config = await getRepoConversionConfig(owner, repo);

  const release = await getLatestRepoRelease(
    config.upstream.owner,
    config.upstream.repo
  );
  if (release) {
    if (release.tagCommit.oid !== config.lastSync.ref) {
      return { release, config };
    }
  }

  return null;
}

export async function checkForNewCommits(
  owner: string,
  repo: string
): Promise<{ commitHash: string; config: ConversionConfig } | null> {
  const config = await getRepoConversionConfig(owner, repo);

  const latestCommit = await getLatestRepoCommit(
    config.upstream.owner,
    config.upstream.repo
  );
  const commitHash = latestCommit.repository.object.oid;

  if (commitHash && commitHash !== config.lastSync.ref) {
    return { commitHash, config };
  }

  return null;
}

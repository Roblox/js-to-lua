import * as semver from 'semver';
import { executeQuery } from './execute-query';

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

function sortByTagNameDesc(a: Release, b: Release) {
  if (!semver.valid(a.tagName) || !semver.valid(b.tagName)) {
    return b.tagName.localeCompare(a.tagName);
  }

  return semver.compare(b.tagName, a.tagName);
}

export async function getLatestRepoRelease(
  owner: string,
  repo: string,
  releasePattern?: RegExp
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
    .filter(({ tagName }) =>
      releasePattern ? releasePattern.test(tagName) : true
    )
    .sort(sortByTagNameDesc);

  return releases.length > 0 ? releases[0] : null;
}

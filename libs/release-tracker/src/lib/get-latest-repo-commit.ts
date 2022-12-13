import { executeQuery } from './execute-query';

export interface CommitResponse {
  repository: {
    object: {
      oid?: string;
    };
  };
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

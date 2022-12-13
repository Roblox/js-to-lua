import { Octokit } from 'octokit';
import * as process from 'process';

export type QueryVariables = { [key: string]: string };

export async function executeQuery<T>(
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

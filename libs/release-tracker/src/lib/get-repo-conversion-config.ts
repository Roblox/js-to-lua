import { safeJsonParse } from '@js-to-lua/shared-utils';
import { ConversionConfig, parseConversionConfig } from './conversion-config';
import { executeQuery } from './execute-query';

export interface ConversionConfigResponse {
  repository: {
    object: {
      text: string;
    };
  };
}

export async function getRepoConversionConfig({
  ref,
  owner,
  repo,
}: {
  owner: string;
  repo: string;
  ref?: string;
}): Promise<ConversionConfig | undefined> {
  const expression = `${ref ?? 'release-tracker-testing'}:js-to-lua.config.js`;

  const query = `
    query GetConversionConfig($owner: String!, $repo: String!, $expression: String!) {
      repository(owner: $owner, name: $repo) {
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
    repo,
    expression,
  });

  const result =
    response.repository.object &&
    safeJsonParse(response.repository.object.text);

  return parseConversionConfig(result);
}

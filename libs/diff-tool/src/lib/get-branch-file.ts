import { exec } from 'child_process';

export function getBranchFile(
  branch: string,
  filename: string
): Promise<string> {
  return new Promise((res, rej) =>
    exec(
      `git show ${branch}:${filename}`,
      function (error: unknown, stdout: string, stderr: string) {
        if (error) {
          rej(stderr);
        }
        res(stdout);
      }
    )
  );
}

import { ConversionConfig } from '@roblox/release-tracker';
import * as fs from 'fs';
import { mkdir, readdir, rename } from 'fs/promises';
import * as path from 'path/posix';

async function getFilesToRename(
  directory: string,
  config: ConversionConfig
): Promise<Array<[string, string]>> {
  const dirContent = await readdir(directory);

  const actions = [] as Array<[string, string]>;

  for await (const file of dirContent) {
    const filePath = path.join(directory, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      actions.push(...(await getFilesToRename(filePath, config)));
    } else {
      if (config.renameFiles) {
        let newFilePath = filePath;

        for await (const [matchFn, replaceFn] of config.renameFiles) {
          if (matchFn(newFilePath)) {
            const currentFilePath = newFilePath;
            newFilePath = replaceFn(currentFilePath);
            actions.push([currentFilePath, newFilePath]);
          }
        }
      }
    }
  }

  return actions;
}

export async function renameFiles(
  directory: string,
  config: ConversionConfig
): Promise<void> {
  const files = (await getFilesToRename(directory, config)).map(
    ([from, to]) => [
      from.startsWith(directory) ? from : path.join(directory, from),
      to.startsWith(directory) ? to : path.join(directory, to),
    ]
  );

  for (const [from, to] of files) {
    console.log('renaming file:', from, '=>', to);
    await mkdir(path.join(to, '..'), { recursive: true });
    await rename(from, to);
  }
}

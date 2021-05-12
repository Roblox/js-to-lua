const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const process = require('process');

const CONFORMANCE_TESTS = path.join(__dirname, '../../conformance-tests');

// returns a list of all the files recursively
async function getFiles(directory) {
  const dirContent = await fs.promises.readdir(directory);

  const allContent = dirContent.map((file) => {
    const filePath = path.join(directory, file);

    return fs.promises.stat(filePath).then((stat) => {
      if (stat.isDirectory()) {
        return getFiles(filePath);
      } else {
        return [path.parse(filePath)];
      }
    });
  });

  return (await Promise.all(allContent)).flat();
}

// asserts that each JavaScript and TypeScript file maps to a Lua file
async function verifyFiles(translateFiles, luaFiles) {
  const luaSet = new Set(luaFiles.map(path.format));
  const errors = [];

  translateFiles.forEach((filePath) => {
    const luaName = `${filePath.name}.lua`;
    const luaPair = path.join(filePath.dir, luaName);

    if (!luaSet.has(luaPair)) {
      errors.push(
        `expected translated Lua file '${luaPair}'` +
          ` for JavaScript file '${path.format(filePath)}'`
      );
    }
  });

  if (errors.length !== 0) {
    throw errors;
  }
}

// run each file with robloxdev-cli to make sure they parse correctly
async function checkIfLuaFileParses(luaFiles) {
  const runChecks = luaFiles.map(async (luaPath) => {
    const formattedPath = path.format(luaPath);
    try {
      execSync(`robloxdev-cli run --run ${formattedPath}`, {
        stdio: [],
      });
    } catch {
      throw `robloxdev-cli is unable to run the file at ${formattedPath}`;
    }
  });
  await Promise.all(runChecks);
}

async function main() {
  console.log('run conformance test suite');

  const files = await getFiles(CONFORMANCE_TESTS);

  const translateFiles = files.filter((filePath) => {
    return filePath.ext === '.js' || filePath.ext === '.ts';
  });
  const luaFiles = files.filter((filePath) => filePath.ext === '.lua');

  await verifyFiles(translateFiles, luaFiles);

  console.log('running Lua files with robloxdev-cli...');
  await checkIfLuaFileParses(luaFiles);

  console.log('completed successfully');
}

main().catch((error) => {
  if (error instanceof Array) {
    console.error('found errors when verifying test cases');
    console.group();
    error.forEach((innerError) => {
      console.error(`  - ${innerError}`);
    });
    console.groupEnd();
  } else {
    console.error(error);
  }
  process.exit(1);
});

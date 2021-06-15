const { execSync } = require('child_process');
const { readdir, mkdir, stat, rm } = require('fs/promises');
const path = require('path');
const process = require('process');

const ROBLOX_CLI = process.argv[2] || 'robloxdev-cli';
const CONFORMANCE_TESTS = path.join(__dirname, '../../conformance-tests');
const OUTPUT_DIR = path.join(__dirname, '../../dist/verify-tests');

// returns a list of all the files recursively
async function getFiles(directory) {
  const dirContent = await readdir(directory);

  const allContent = dirContent.map((file) => {
    const filePath = path.join(directory, file);

    return stat(filePath).then((stat) => {
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
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });
  const runChecks = luaFiles.map(async (luaPath) => {
    const formattedPath = path.format(luaPath);
    const relativePath = path.relative('./', formattedPath);
    try {
      const testFile = path.join(OUTPUT_DIR, `${relativePath}`);
      const testFileDir = path.parse(testFile).dir;
      await mkdir(testFileDir, { recursive: true });
      execSync(
        `cat ${path.join(
          __dirname,
          'verification-polyfills.lua'
        )} > ${testFile}`,
        {
          stdio: [],
        }
      );
      execSync(`cat ${formattedPath} >> ${testFile}`, {
        stdio: [],
      });
      console.info(`verifying... ${relativePath}`);
      execSync(`${ROBLOX_CLI} run --run ${testFile}`, {
        stdio: [],
      });
    } catch {
      console.error(
        `${ROBLOX_CLI} is unable to run the file at ${relativePath}`
      );
      throw `${ROBLOX_CLI} is unable to run the file at ${relativePath}`;
    }
  });
  const checks = await Promise.allSettled(runChecks);
  const errors = checks
    .filter(({ status }) => status !== 'fulfilled')
    .map(({ reason }) => reason);
  if (errors.length) {
    throw errors;
  }
}

async function main() {
  console.info('run conformance test suite');

  const files = await getFiles(CONFORMANCE_TESTS);

  const translateFiles = files.filter((filePath) => {
    return filePath.ext === '.js' || filePath.ext === '.ts';
  });
  const luaFiles = files.filter((filePath) => filePath.ext === '.lua');

  await verifyFiles(translateFiles, luaFiles);

  console.info(`running Lua files with ${ROBLOX_CLI}...`);
  const luaFilesThatShouldParse = luaFiles.filter(
    (filePath) => !/_m\d?x$/.test(filePath.name)
  );
  await checkIfLuaFileParses(luaFilesThatShouldParse);

  console.info('completed successfully');
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

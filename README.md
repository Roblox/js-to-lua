# JsToLua

Conversion tool for migrating JS/TS code into Luau.

## Prerequisites

**The project requires the following tools:**

- [Node](https://nodejs.org) (version >= 14)
- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

## Setup

### stylua-wasm dependency

We're maintaining our local [Stylua](https://github.com/JohnnyMorganz/StyLua) WASM port. Since it is used as a dependency for our project you need to build it first.
You can read more details on `stylua-wasm` specific [README](libs/stylua-wasm/README.md).

To build `stylua-wasm` you need the following tools:

- [install Rust](https://www.rust-lang.org/tools/install)
- [`wasm-pack` installer](https://rustwasm.github.io/wasm-pack/installer/)

After installing those tools you can build `stylua-wasm`. To do so just run the following command:

```bash
npm run build:stylua-wasm
```

### Project installation

To install all the other dependencies run `npm install`

### Building CLI tool

To build the CLI tool just run the following command:

```bash
npm run build:prod
```

The build JS file will be placed in `dist/apps/convert-js-to-lua/main.js`

## Usage

The CLI tool accepts the following input parameters:

- `--input` (`-i`) - a list of input file(s) or glob patterns (for more info on supported format please read the [glob package docs](https://github.com/isaacs/node-glob#readme))
- `--output` (`-o`) - a directory in which the output files should be saved. The tool will keep the files structure of the input files.
- `--babelConfig` - a path to a JSON file containing [Babel Configuration options](https://babeljs.io/docs/en/configuration). This param is optional. In case it's not provided the tool will use the following default configration:
  ```json
  {
    "sourceType": "unambiguous",
    "plugins": ["jsx", "typescript", "classProperties"]
  }
  ```

To show help you can always use `--help` flag.

```bash
node dist/apps/convert-js-to-lua/main.js --help
```

To run the JS/TS files via the conversion tool let's assume the following file structure:

```
js-to-lua
  - dist/apps/convert-js-to-lua/main.js

source-files
  - file1.js
  - file2.ts
  - directory
    - inner-file1.js
    - inner-file2.ts
```

To convert all the files in `source-files` directory you can run the following command:

```bash
node ./js-to-lua/dist/apps/convert-js-to-lua/main.js \
 --input source-files/**/*.js source-files/**/*.ts \
 --output lua-source-files
```

If `source-files` contain files using Flow types you can use a provided default flow configuration:

```bash
node ./js-to-lua/dist/apps/convert-js-to-lua/main.js \
 --input source-files/**/*.js source-files/**/*.ts \
 --output lua-source-files \
 --babelConfig js-to-lua/babel-flow.config.json
```

This will output the Lua files into the following file structure:

```
lua-source-files
  - file1.lua
  - file2.lua
  - directory
    - inner-file1.lua
    - inner-file2.lua
```

## Testing

To run unit tests you can use the following npm script:

```bash
npm run affected:test
```

**Note:** This will only run the tests that are affected by your changes. If you want to run all tests use the following command:

```bash
npm run test:all
```

## Linting

We use ESLint for style checking the codebase. To run linting you can use the following npm script:

```bash
npm run affected:lint
```

**Note:** This will only run the linting on projects that are affected by your changes. If you want to lint all projects use the following command:

```bash
npm run lint:all
```

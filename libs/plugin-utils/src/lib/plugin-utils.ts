import { LuaProgram } from '@js-to-lua/lua-types';
import { identity, pipe } from 'ramda';

export type ProcessProgramFunction = (program: LuaProgram) => LuaProgram;

const postProcessHooks = [
  'preGather',
  'postGather',
  'preRun',
  'postRun',
  'preCleanup',
] as const;

type PostProcessOptions = Record<
  typeof postProcessHooks[number],
  Array<ProcessProgramFunction>
>;

type PostProcessPluginOptions = Record<
  typeof postProcessHooks[number],
  ProcessProgramFunction
>;

export type JsToLuaPlugin = {
  postProcess: Partial<PostProcessPluginOptions>;
};

const emptyPostProcessHooks = () =>
  postProcessHooks
    .map((hook) => ({ [hook]: new Array<PostProcessOptions>() }))
    .reduce((a, b) => Object.assign(a, b), {} as PostProcessOptions);

const normalizeOptions = (
  options: Array<JsToLuaPlugin>
): PostProcessOptions => {
  return options
    .map((plugin) => {
      return plugin.postProcess;
    })
    .reduce((res, postProcess) => {
      (
        Object.entries(postProcess) as Array<
          [keyof PostProcessOptions, ProcessProgramFunction]
        >
      ).forEach(([key, value]) => {
        res = {
          ...res,
          [key]: [...res[key], value],
        };
      });
      return res;
    }, emptyPostProcessHooks());
};

// TODO: improve ramda types so that this helper is not needed
const pipeProcessProgramFunctions = (
  ...processFns: Array<ProcessProgramFunction>
) =>
  processFns.length
    ? pipe(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...processFns
      )
    : identity;

export const getPluginsStages = (plugins: Array<JsToLuaPlugin>) => {
  const { preGather, postGather, preRun, postRun, preCleanup } =
    normalizeOptions(plugins);

  return {
    preGather: pipeProcessProgramFunctions(...preGather),
    postGather: pipeProcessProgramFunctions(...postGather),
    preRun: pipeProcessProgramFunctions(...preRun),
    postRun: pipeProcessProgramFunctions(...postRun),
    preCleanup: pipeProcessProgramFunctions(...preCleanup),
  };
};

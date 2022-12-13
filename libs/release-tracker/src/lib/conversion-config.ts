import { z } from 'zod';

export type ConversionConfig = z.infer<typeof conversionConfigSchema>;

const replaceFileTupleSchema = z.tuple([
  z.function(z.tuple([z.string()]), z.boolean()),
  z.function(z.tuple([z.string()]), z.string()),
]);

const repoBasicInfoSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  primaryBranch: z.string(),
});

const regexpSchema = z.preprocess(
  (data) =>
    data instanceof RegExp
      ? data
      : typeof data === 'string'
      ? new RegExp(data)
      : undefined,
  z.custom<RegExp>((data) => data instanceof RegExp)
);

const conversionConfigSchema = z.object({
  lastSync: z.object({
    ref: z.string(),
    conversionToolVersion: z.string(),
  }),
  upstream: repoBasicInfoSchema,
  downstream: z.intersection(
    repoBasicInfoSchema,
    z.object({
      patterns: z.array(z.string()),
      ignorePatterns: z.optional(z.array(z.string())),
    })
  ),
  renameFiles: z.optional(z.array(replaceFileTupleSchema)),
  releasePattern: z.optional(regexpSchema),
});

export const verifyConversionConfig = (
  obj: unknown
): obj is ConversionConfig => {
  return conversionConfigSchema.safeParse(obj).success;
};

export const parseConversionConfig = (
  obj: unknown
): ConversionConfig | undefined => {
  const parsed = conversionConfigSchema.safeParse(obj);
  return parsed.success ? parsed.data : undefined;
};

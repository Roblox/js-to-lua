import { ConfigBase } from '@js-to-lua/handler-utils';

export interface NoShadowIdentifiersConfig {
  noShadowIdentifiers?: string[];
}

export const noShadowIdentifiersConfig =
  (
    ...noShadowIdentifiers: NonNullable<
      NoShadowIdentifiersConfig['noShadowIdentifiers']
    >
  ) =>
  <C extends ConfigBase>(config: C): C & NoShadowIdentifiersConfig => ({
    ...config,
    ...(noShadowIdentifiers && noShadowIdentifiers.length
      ? { noShadowIdentifiers }
      : {}),
  });

export const removeNoShadowIdentifierConfig = <
  C extends NoShadowIdentifiersConfig
>(
  config: C
): Omit<C, 'noShadowIdentifiers'> => {
  const newConfig = { ...config };
  delete newConfig.noShadowIdentifiers;
  return newConfig;
};

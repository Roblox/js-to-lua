export const normalizeTagUser = (tagString: string): string | undefined => {
  const tagNameMatch = /@?(?<name>.+)/.exec(tagString);

  if (tagNameMatch?.groups?.name) {
    return `@${tagNameMatch.groups.name}`;
  }
};

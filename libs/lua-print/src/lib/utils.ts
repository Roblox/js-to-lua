export const calculateEqualsForDelimiter = (luaMultilineString: string) => {
  let numberOfEquals = 0;
  while (!validNumberOfEquals(luaMultilineString, numberOfEquals)) {
    numberOfEquals++;
  }
  return numberOfEquals;
};

const validNumberOfEquals = (
  luaMultilineString: string,
  numberOfEquals: number
) => {
  if (!numberOfEquals && luaMultilineString.endsWith(']')) {
    return false;
  }
  return !(
    luaMultilineString.includes(`[${'='.repeat(numberOfEquals)}[`) ||
    luaMultilineString.includes(`]${'='.repeat(numberOfEquals)}]`)
  );
};

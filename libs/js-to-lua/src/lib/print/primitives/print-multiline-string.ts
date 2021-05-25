import { LuaMultilineStringLiteral } from '../../lua-nodes.types';

export function printMultilineString(node: LuaMultilineStringLiteral) {
  const numberOfEquals = calculateEqualsForDelimiter(node.value);
  return `[${'='.repeat(numberOfEquals)}[${node.value}]${'='.repeat(
    numberOfEquals
  )}]`;
}

const calculateEqualsForDelimiter = (luaMultilineString: string) => {
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
  return !(
    luaMultilineString.includes(`[${'='.repeat(numberOfEquals)}[`) ||
    luaMultilineString.includes(`]${'='.repeat(numberOfEquals)}]`)
  );
};

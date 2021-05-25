export const splitBy = <N, T extends N>(
  predicate: (value: N) => value is T
) => (groups: Array<T | Array<Exclude<N, T>>>, prop: N) => {
  if (predicate(prop)) {
    groups.push(prop);
  } else {
    const propNotT = prop as Exclude<N, T>;
    if (groups.length === 0) {
      groups.push([]);
    }
    const lastGroup = groups.slice(-1)[0];
    if (Array.isArray(lastGroup)) {
      lastGroup.push(propNotT);
    } else {
      groups.push([propNotT]);
    }
  }
  return groups;
};

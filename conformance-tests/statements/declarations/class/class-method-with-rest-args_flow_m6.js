class EntityStore {
  makeCacheKey(...args: any[]): any {
    return this.group.keyMaker.lookupArray(args);
  }
}

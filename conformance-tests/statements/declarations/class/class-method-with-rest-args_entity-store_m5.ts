class EntityStore {
  public makeCacheKey(...args: any[]): any;
  public makeCacheKey() {
    return this.group.keyMaker.lookupArray(arguments);
  }
}

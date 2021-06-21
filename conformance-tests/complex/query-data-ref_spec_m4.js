function getCurrent(queryDataRef) {
  const context = {};
  const queryData = queryDataRef.current || (queryDataRef.current = {
    context,
    onNewData() {}
  });

  return queryData;
}

describe('Query Data Ref', () => {
  it('should use existing current', () => {
    const givenCurrent = {
      context: 'context', onNewData() {
      }
    }
    const given = {
      current: givenCurrent
    };
    const result = getCurrent(given);

    expect(result).toBe(givenCurrent)
  });

  it('should initialize current', () => {
    const given = {};
    const result = getCurrent(given);

    expect(result).toBeDefined()
    expect(given.current).toBeDefined()
    expect(result).toBe(given.current)
  });
});

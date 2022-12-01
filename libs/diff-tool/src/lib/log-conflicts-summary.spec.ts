import { logConflictsSummary } from './log-conflicts-summary';

describe('log-conflicts-summary', function () {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {
    /* Do nothing */
  });
  const summary = {
    ['foo']: { conflicts: 1, lines: 3 },
    ['bar']: { conflicts: 2, lines: 2 },
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should log to the console', function () {
    logConflictsSummary(summary);
    expect(spy).toHaveBeenCalled();
  });

  it('should log count of files with conflicts', function () {
    logConflictsSummary(summary);
    expect(spy).toHaveBeenCalledWith('Total files with conflicts:', 2);
  });

  it('should log count of conflicts', function () {
    logConflictsSummary(summary);
    expect(spy).toHaveBeenCalledWith('Total conflicts:', 3);
  });

  it('should log conflicts details', function () {
    logConflictsSummary(summary);
    expect(spy).toHaveBeenCalledWith('Total conflicted lines:', 5);
  });
});

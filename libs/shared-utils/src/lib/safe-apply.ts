export const safeApply =
  <T>(fn: (arg: T) => T, defaultValue?: T) =>
  (arg: T) => {
    try {
      return fn(arg);
    } catch {
      console.warn('failed to format file');
      return defaultValue || arg;
    }
  };

function noopAct() {
  try {
    const thenable = batchedUpdates(scope);
    if (
      typeof thenable === 'object' &&
      thenable !== null &&
      typeof thenable.then === 'function'
    ) {
      return {
        then(resolve: () => void, reject: (error: mixed) => void) {
          thenable.then(
            () => {
              flushActWork(
                () => {
                  unwind();
                  resolve();
                },
                (error) => {
                  unwind();
                  reject(error);
                }
              );
            },
            (error) => {
              unwind();
              reject(error);
            }
          );
        },
      };
    } else {
      try {
        let didFlushWork;
        // CONFORMANCE TEST: unhandled
        // do {
        //   didFlushWork = Scheduler.unstable_flushAllWithoutAsserting();
        // } while (didFlushWork);
      } finally {
        unwind();
      }
    }
  } catch (error) {
    unwind();
    throw error;
  }
}

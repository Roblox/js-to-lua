const observerOptions = {
  next(result: any) {
    try {
      switch (count++) {
        case 0:
          if (!result.data!.allPeople) {
            reject('Should have data by this point');
            break;
          }
          expect(stripSymbols(result.data!.allPeople)).toEqual(data.allPeople);
          setTimeout(() => {
            observable.refetch().then(() => {
              reject('Expected error value on first refetch.');
            }, noop);
          }, 0);
          break;
        case 4:
          expect(result.loading).toBeFalsy();
          expect(result.networkStatus).toBe(7);
          expect(result.errors).toBeFalsy();
          if (!result.data) {
            reject('Should have data by this point');
            break;
          }
          expect(stripSymbols(result.data.allPeople)).toEqual(
            dataTwo.allPeople
          );
          resolve();
          break;
        default:
          throw new Error('Unexpected fall through');
      }
    } catch (e) {
      reject(e);
    }
  },
};

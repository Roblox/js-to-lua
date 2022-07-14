class MockModule {

  spyOn<T extends {}, M extends NonFunctionPropertyNames<T>>(
    object: T,
    methodName: M,
    accessType: 'get',
  ): SpyInstance<T[M], []>;

  spyOn<T extends {}, M extends NonFunctionPropertyNames<T>>(
    object: T,
    methodName: M,
    accessType: 'set',
  ): SpyInstance<void, [T[M]]>;

  spyOn<T extends {}, M extends FunctionPropertyNames<T>>(
    object: T,
    methodName: M,
  ): T[M] extends (...args: Array<any>) => any
    ? SpyInstance<ReturnType<T[M]>, Parameters<T[M]>>
    : never;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  spyOn<T extends {}, M extends NonFunctionPropertyNames<T>>(
    object: T,
    methodName: M,
    accessType?: 'get' | 'set',
  ) {}
}

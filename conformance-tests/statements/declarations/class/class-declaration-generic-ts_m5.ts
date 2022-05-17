class BaseClass<T>{}
class MyClass<V, W> extends BaseClass<V>{}
class MyClassWithDefault<V = number, W = string> extends BaseClass<V>{}

-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/interface-declaration/generic-extends_m6.js
type Test<T, U, V> = Foo<V> & Bar<T> & Baz<U> & {}

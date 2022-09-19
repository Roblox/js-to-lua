-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/generic-type-annotation/generic-type-annotation-multiple-params2_m6.js
type Fizz<A, B, C> = Buzz<A, B, C>
type Foo<X, Y, Z> = Bar<Z, Y, X>

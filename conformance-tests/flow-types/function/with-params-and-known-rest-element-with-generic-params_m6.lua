-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/function/with-params-and-known-rest-element-with-generic-params_m6.js
type Fn = <T, U>(foo: T, ...U) -> boolean
type Fn2 = <T, U>(foo: T, ...U) -> boolean

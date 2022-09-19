-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/function/recursive-with-generic-params_m6.js
type FnFnFn = <T>(arg: T) -> <V, Z>(foo: (V) -> Z) -> number

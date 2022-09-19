-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/object/method-function-expression-with-args-typed_m2.ts
local foo = { bar = function(self, arg1: string, arg2: number): () end }

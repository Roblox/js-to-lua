-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/ts-type-query/function-param_m5.ts
local foo = "foo"
local function fn(bar: typeof(foo)) end

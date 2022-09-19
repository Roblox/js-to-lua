-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/non-null/in-a-index-expression_m5.ts
local foo = {}
local bar = "bar"
local baz = (foo :: any)[tostring(bar :: any)]

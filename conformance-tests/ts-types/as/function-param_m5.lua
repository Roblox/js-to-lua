-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/as/function-param_m5.ts
local function foo(b) end
local bar = "bar"
foo(bar :: any)

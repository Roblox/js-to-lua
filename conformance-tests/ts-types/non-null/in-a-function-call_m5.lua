-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/non-null/in-a-function-call_m5.ts
local function foo(_v) end
local bar = "bar";
(foo :: any)(bar :: any)

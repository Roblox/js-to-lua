-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/expressions/with-default-value-numeric_m5.ts
local function foo(bar_: number?)
	local bar: number = if bar_ ~= nil then bar_ else 1
end

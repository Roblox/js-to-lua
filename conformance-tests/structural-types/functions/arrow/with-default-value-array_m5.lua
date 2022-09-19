-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/arrow/with-default-value-array_m5.ts
local function foo(bar_: Array<any>?)
	local bar: Array<any> = if bar_ ~= nil then bar_ else {}
end

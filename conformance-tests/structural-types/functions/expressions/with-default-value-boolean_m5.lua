-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/expressions/with-default-value-boolean_m5.ts
local function foo(bar_: boolean?)
	local bar: boolean = if bar_ ~= nil then bar_ else true
end

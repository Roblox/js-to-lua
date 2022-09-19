-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/arrow/with-default-value-object_m5.ts
local function foo(bar_: Object?)
	local bar: Object = if bar_ ~= nil then bar_ else {}
end

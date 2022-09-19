-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/expressions/with-default-value-typed_m5.ts
local function foo(bar_: (string | number)?)
	local bar: string | number = if bar_ ~= nil then bar_ else "bar"
end

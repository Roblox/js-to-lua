-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/named/with-default-value-string_m5.ts
local function foo(bar_: string?)
	local bar: string = if bar_ ~= nil then bar_ else "bar"
end

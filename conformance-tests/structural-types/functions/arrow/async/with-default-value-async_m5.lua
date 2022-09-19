-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/arrow/async/with-default-value-async_m5.js
local function foo(bar_: any?)
	local bar: any = if bar_ ~= nil then bar_ else defaultBar
	return Promise.resolve(nil)
end

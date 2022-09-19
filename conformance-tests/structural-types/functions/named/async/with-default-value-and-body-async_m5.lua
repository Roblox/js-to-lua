-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/named/async/with-default-value-and-body-async_m5.js
local function foo(bar_: any?)
	local bar: any = if bar_ ~= nil then bar_ else defaultBar
	return Promise.resolve():andThen(function()
		local foo = "foo"
		bar:expect()
		return foo
	end)
end

-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/iife-with-body-and-default-params-async_m5.js
(function(bar_: any?)
	local bar: any = if bar_ ~= nil then bar_ else defaultBar
	return Promise.resolve():andThen(function()
		return bar:expect()
	end)
end)()

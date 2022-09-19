-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/iife-with-body-async_m5.js
(function()
	return Promise.resolve():andThen(function()
		return bar:expect()
	end)
end)()

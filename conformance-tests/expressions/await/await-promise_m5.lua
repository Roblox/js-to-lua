-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/await/await-promise_m5.js
local function f()
	return Promise.resolve():andThen(function()
		local foo = Promise.resolve():expect()
	end)
end

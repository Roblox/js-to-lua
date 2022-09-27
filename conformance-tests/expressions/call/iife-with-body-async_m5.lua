-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/iife-with-body-async_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local Promise = require(Packages.Promise);
(function()
	return Promise.resolve():andThen(function()
		return bar:expect()
	end)
end)()

-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/await/await-identifier_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local Promise = require(Packages.Promise)
local function f()
	return Promise.resolve():andThen(function()
		local bar = foo:expect()
	end)
end

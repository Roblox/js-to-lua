-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/expressions/async/with-default-value-and-body-async_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local Promise = require(Packages.Promise)
local function foo(bar_: any?)
	local bar: any = if bar_ ~= nil then bar_ else defaultBar
	return Promise.resolve():andThen(function()
		return bar:expect()
	end)
end

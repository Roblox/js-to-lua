-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/known-array-methods/definitely-array/chained-call_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local foo = Array.reduce(
	Array.map(
		Array.filter(arr, function(x)
			return x ~= 7
		end),
		function(x)
			return x * 2
		end
	),
	function(a, b)
		return a + b
	end
)

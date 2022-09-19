-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/known-array-methods/maybe-array/chained-apply_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local foo = Array.reduce(
	Array.map(
		Array.filter(arr, table.unpack(filterArgs)), --[[ ROBLOX CHECK: check if 'arr' is an Array ]]
		function(x)
			return x * 2
		end
	),
	function(a, b)
		return a + b
	end
)

local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local foo = Array.reduce(
	Array.map(Array.filter(arr, table.unpack(filterArgs)), function(x)
		return x * 2
	end),
	function(a, b)
		return a + b
	end
)

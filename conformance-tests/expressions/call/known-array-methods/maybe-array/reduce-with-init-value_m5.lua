local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
Array.reduce(arr, function(a, b)
	return a + b
end, 0) --[[ ROBLOX CHECK: check if 'arr' is an Array ]]

local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
Array.map(arr, function(n)
	return n * 2
end) --[[ ROBLOX CHECK: check if 'arr' is an Array ]]

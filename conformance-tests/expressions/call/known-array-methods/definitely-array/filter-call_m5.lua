local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
Array.filter({ 1, 2, 3, 4, 5 }, function()
	return true
end)

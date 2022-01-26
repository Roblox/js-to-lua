local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
Array.map({ 1, 2, 3, 4, 5 }, table.unpack(args))

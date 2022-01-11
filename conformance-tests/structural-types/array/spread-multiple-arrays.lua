local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local arr = Array.concat({}, { 1, 2 }, { 3, 4 }, { 5, 6, 7 }, { 8, 9 })

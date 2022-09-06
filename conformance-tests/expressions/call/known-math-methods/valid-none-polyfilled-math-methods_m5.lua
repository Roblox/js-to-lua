local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Math = LuauPolyfill.Math
Math.trunc(3.143) --[[ ROBLOX NOTE: Math.trunc is currently not supported by the lua Math polyfill, please add your own implementation or file a ticket on the same ]]

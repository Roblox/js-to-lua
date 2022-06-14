local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local setTimeout = LuauPolyfill.setTimeout
setTimeout(function() end, 10)

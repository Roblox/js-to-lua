local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy4 = ""
local falsy = nil
local foo = if Boolean.toJSBoolean(falsy4) then falsy else falsy4

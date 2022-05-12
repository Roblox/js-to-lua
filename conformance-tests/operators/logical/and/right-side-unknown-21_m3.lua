local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy4 = "truthy"
local falsy = nil
local foo = if Boolean.toJSBoolean(truthy4) then falsy else truthy4

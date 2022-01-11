local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy4 = "truthy"
local falsy = nil
local foo = Boolean.toJSBoolean(truthy4) and truthy4 or falsy

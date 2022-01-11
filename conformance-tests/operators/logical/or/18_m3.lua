local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy1 = 1
local falsy = nil
local foo = Boolean.toJSBoolean(truthy1) and truthy1 or falsy

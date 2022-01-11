local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy3 = {}
local falsy = nil
local foo = Boolean.toJSBoolean(truthy3) and truthy3 or falsy

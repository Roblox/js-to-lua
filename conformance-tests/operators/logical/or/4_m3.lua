local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy4 = ""
local truthy = {}
local foo = Boolean.toJSBoolean(falsy4) and falsy4 or truthy

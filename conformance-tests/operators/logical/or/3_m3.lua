local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy3 = 0
local truthy = {}
local foo = Boolean.toJSBoolean(falsy3) and falsy3 or truthy

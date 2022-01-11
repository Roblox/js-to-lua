local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy2 = nil
local falsy = nil
local foo = Boolean.toJSBoolean(falsy2) and falsy2 or falsy

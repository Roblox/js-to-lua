local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy4 = ""
local falsy = nil
local foo = Boolean.toJSBoolean(falsy4) and falsy4 or falsy

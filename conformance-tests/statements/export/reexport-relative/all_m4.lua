local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local exports = {}
Object.assign(exports, require(script.Parent.foo.bar))
return exports

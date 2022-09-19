-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/export/reexport-relative/all_m4.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local exports = {}
Object.assign(exports, require(script.Parent.foo.bar))
return exports

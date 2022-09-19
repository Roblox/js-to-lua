-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/ternary/4_m4.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b, c, d, e
local f = if Boolean.toJSBoolean(a) then if Boolean.toJSBoolean(b) then c else d else e
